/**
 * App Entry Point
 * -----------
 * npm run dev: Local development server
 * npm run deploy: Builds and deploys to GitHub Pages
 */

import { useMemo, useEffect, useState, useRef } from 'react';
import './App.css';

/* High level components */
import Map from './layout/Map/Map.jsx';
import Toolbar from './layout/Toolbar/Toolbar';
import Sidebar from './layout/Sidebar/Sidebar';
import Drawer from './layout/Drawer/Drawer';

/* Popups */
import StatusPopup from '@/layout/Popups/StatusPopup/StatusPopup.jsx';

/* MODALS */
import ExportModal from '@/layout/Modal/modals/ExportModal/ExportModal.jsx';
import OpenProjectModal from '@/layout/Modal/modals/OpenProjectModal/OpenProjectModal.jsx';
import HowToModal from '@/layout/Modal/modals/HowToModal/HowToModal.jsx';
import AboutModal from '@/layout/Modal/modals/AboutModal/AboutModal.jsx';

import UnsavedChangesModal from '@/layout/Modal/modals/UnsavedChangesModal.jsx';
import SaveModal from '@/layout/Modal/modals/SaveModal.jsx';
import LargeDatasetModal from '@/layout/Modal/modals/LargeDatasetModal.jsx';
import RestoreSessionModal from '@/layout/Modal/modals/RestoreSessionModal.jsx';

/* Map related components */
import Legend from './components/Legend/Legend.jsx';

/* Hooks */
import useBoundaryManager from './hooks/useBoundaryManager.js';
import useLayerManager from './hooks/useLayerManager.js';
import useFilteredLayers from './hooks/useFilteredLayers.js';
import useStatusPopup from './hooks/useStatusPopup.js';
import useSession from './hooks/useSession.js';
import useProjectManager from './hooks/useProjectManager.js';
import useUnsavedChanges from './hooks/useUnsavedChanges.js';

/* Misc imports */
import { FEATURE_OPTIONS } from './config/featureOptions.js';
import { createSession } from './models/session.js';
//import { isProjectSession } from './utils/sessionUtils';

import { getProject } from './db/projectDB.js';

const MODALS = {
	EXPORT: 'export',
	UNSAVED_CHANGES: 'unsavedChanges',
	SAVE_PROJECT: 'saveProject',
	OPEN_PROJECT: 'openProject',
	RESTORE_SESSION: 'restoreSession',
	LARGE_DATASET: 'largeDataset',
	HOW_TO: 'howTo',
	ABOUT: 'about',
};

export default function App() {
	const LARGE_DATASET_LIMIT = 5000;

	/* UI STATES */
	const [pendingSession, setPendingSession] = useState(null);
	const didRestore = useRef(false);

	const [activeDrawer, setActiveDrawer] = useState(null); // which drawer is open
	const [activeLayer, setActiveLayer] = useState(null); // which layer the user is inspecting
	const [activeModal, setActiveModal] = useState(null);

	const [basemap, setBasemap] = useState('carto');
	const [displayMode, setDisplayMode] = useState('default'); // or by last edit

	const [focusTrigger, setFocusTrigger] = useState(0);

	/* DATA STATES */
	const [sessionInfo, setSessionInfo] = useState(createSession());
	const [selectedBoundaryKey, setSelectedBoundaryKey] = useState('none');
	const [pendingLayer, setPendingLayer] = useState(null);

	/* Manages states for boundaries */
	const {
		// boundary data
		boundaryData,
		boundaryGeojson,
		boundaryName = boundaryData?.elements?.[0]?.tags?.name ?? 'None', // human readable name

		// boundary
		boundaryResults,
		loadBoundaryResults,
		clearBoundaryResults,

		// boundary handling
		loadBoundary,
		clearBoundary,
		restoreBoundary,
		//exportBoundary,

		// status
		status: boundaryStatus,
		error: boundaryError,
	} = useBoundaryManager({
		onChange: () => setIsDirty(true),
	});

	/* Manages states for data displayed on map */
	const {
		//state
		featureLayers,

		// data operations
		loadLayer,
		commitLayer,
		clearLayers,
		removeLayer,

		// layer editing
		toggleLayerVisibility,
		updateLayer,
		updateLayerFilters,

		// persistence
		exportLayers,
		restoreLayers,

		// cache
		getCachedFeatures,
		clearCache,

		// status
		failedFeatureKey,
		clearStatus,
		status: featureStatus,
		error: featureError,
	} = useLayerManager({
		onChange: () => setIsDirty(true),
	});

	const { statusPopup /*dismissPopup*/ } = useStatusPopup({
		boundaryStatus,
		boundaryError,

		featureStatus,
		featureError,
		failedFeatureKey,
	});

	/**
	 * Handle input for boundary search
	 */
	const handleSelectBoundary = (result) => {
		console.log('[DEBUG] handleSelectBoundary ENTER:', result);

		const {
			osm_id: boundaryID,
			osm_type: boundaryType,
			display_name: boundaryName,
		} = result;

		setSelectedBoundaryKey(boundaryID);

		loadBoundary(boundaryID, boundaryType, boundaryName);
	};

	/**
	 * Handle resetting boundary and wiping features
	 */
	const handleClearBoundary = () => {
		setSelectedBoundaryKey('none');
		clearBoundary();
		clearLayers();
	};

	/* Handle renaming features */
	const renameLayer = (layerID, newLabel) => {
		updateLayer(layerID, {
			displayName: newLabel,
		});
	};

	/*
	 * Handle feature adding to project
	 */
	const handleAddLayer = async (
		featureKey,
		featureTag,
		featureValue,
		featureType,
		featureLabel
	) => {
		console.log(
			`Calling loadLayer with boundary key: ${selectedBoundaryKey}`
		);

		const preparedLayer = await loadLayer({
			featureKey,
			boundaryKey: selectedBoundaryKey,
			featureTag,
			featureValue,
			featureType,
			featureLabel,
		});

		if (!preparedLayer) return;

		if (preparedLayer.totalCount > LARGE_DATASET_LIMIT) {
			setPendingLayer(preparedLayer);
			setActiveModal(MODALS.LARGE_DATASET);
			return;
		}

		commitLayer(preparedLayer);

		setIsDirty(true);
	};

	/*
	 * Memorises the current boundary
	 */
	const boundaryState = useMemo(
		() => ({
			selectedBoundaryKey,
			data: boundaryData,
			geojson: boundaryGeojson,
		}),
		[selectedBoundaryKey, boundaryData, boundaryGeojson]
	);

	/*
	 * Restores a saved session, including the project, map settings, boundaries, and layers.
	 */
	async function restoreSession(session) {
		if (!session) return;

		console.log('[DEBUG] Restoring session:', session);

		console.log(
			'[DEBUG] Session type:',
			session.projectId
				? `Project (${session.projectId})`
				: 'Temporary session'
		);

		console.log('[DEBUG] Session data:', session.data);

		setSessionInfo(session);

		// If the session matches the ID of a project
		if (session.projectId) {
			const project = await getProject(session.projectId);

			if (project) {
				setProject(project);
			}
		}

		const sessionData = session.data ?? {};

		restoreWorkspaceSettings(sessionData);

		restoreBoundary(sessionData.boundary);
		restoreLayers(sessionData.layers ?? []);

		setIsDirty(false);
	}

	/*
	 * Helper to restore workspace settings
	 */
	function restoreWorkspaceSettings(sessionData) {
		setBasemap(sessionData.settings?.basemap ?? 'carto');
		setDisplayMode(sessionData.settings?.displayMode ?? 'default');
		setSelectedBoundaryKey(
			sessionData.boundary?.selectedBoundaryKey ?? 'none'
		);
	}

	const handleNewWorkspace = () => {
		confirmUnsavedChanges(resetWorkspace);
	};

	const handleOpenProject = (projectId) => {
		confirmUnsavedChanges(() => {
			openProject(projectId, restoreSession);
			setActiveModal(null);
		});
	};

	function handleProjectDeleted(id) {
		if (project?.metadata.id !== id) return;

		console.log('[DEBUG] Deleted active project');

		resetWorkspace();
	}

	/*
	 *	Handles the management of the current working session
	 */
	const sessionManager = useSession({
		sessionInfo,

		basemap,
		displayMode,

		boundary: boundaryState,

		layers: exportLayers(),

		onRestore: (session) => {
			setPendingSession(session);
			setActiveModal(MODALS.RESTORE_SESSION);
		},
	});

	const { restoreSavedSession, clearSavedSession } = sessionManager;

	/*
	 * Creates a blank workspace
	 */
	const resetWorkspace = ({ preserveAutosave = false } = {}) => {
		console.log('[DEBUG] Resetting workspace');

		if (!preserveAutosave) {
			clearSavedSession(); // If resetting the session should keep the autosave for any reason
		}

		// clear states
		setProject(null);
		setSessionInfo(createSession());

		clearBoundaryResults();
		clearBoundary();
		clearLayers();
		clearCache();

		setSelectedBoundaryKey('none');

		setBasemap('carto');
		setDisplayMode('default');

		setActiveModal(null);
		setActiveDrawer(null);
		setIsDirty(false);
	};

	/*
	 * Restore session on refresh or open
	 */
	useEffect(() => {
		if (didRestore.current) return;

		didRestore.current = true;

		restoreSavedSession();
	}, [restoreSavedSession]);

	/* FLAGS */
	const [isDirty, setIsDirty] = useState(false);
	const hasBoundary = Object.keys(boundaryData ?? {}).length > 0; // Flag to check if boundary exists
	const hasFeatures = Object.keys(featureLayers).length > 0; // Flag to check if features exist
	const filteredLayers = useFilteredLayers(featureLayers);

	/*
	 *Handles projects
	 */
	const {
		project,
		setProject,

		openProject,
		saveCurrentProject,
		saveProjectAs,
	} = useProjectManager({
		workspace: {
			basemap,
			displayMode,

			selectedBoundaryKey,
			boundaryData,
			boundaryGeojson,

			exportLayers,
		},

		session: {
			sessionInfo,
			setSessionInfo,
		},

		restore: {
			restoreSession,
			restoreBoundary,
			restoreLayers,
		},

		resetWorkspace: resetWorkspace,

		onDirtyChange: setIsDirty,
		onSaveAsRequested: () => setActiveModal(MODALS.SAVE_PROJECT),
	});

	/*
	 * Hook for managing any unsaved changes changes within the session
	 */
	const {
		confirmUnsavedChanges,
		handleSaveAndContinue,
		handleDiscardAndContinue,
		handleCancel,
	} = useUnsavedChanges({
		isDirty,
		setActiveModal,
		modalKey: MODALS.UNSAVED_CHANGES,
		saveCurrentProject,
	});

	return (
		<div className="App">
			{/* Popups */}
			<StatusPopup
				trigger={statusPopup.trigger}
				type={statusPopup.type}
				title={statusPopup.title}
				message={statusPopup.message}
				drawerOpen={activeDrawer !== null}
			/>

			{/* Modals */}
			{activeModal === MODALS.RESTORE_SESSION && (
				<RestoreSessionModal
					onRestore={() => {
						if (!pendingSession) return;

						restoreSession(pendingSession);

						setPendingSession(null);
						setActiveModal(null);
					}}

					onStartNew={() => {
						sessionManager.clearSavedSession();

						setPendingSession(null);
						setActiveModal(null);

						resetWorkspace();
					}}

					onClose={() => {
						setPendingSession(null);
						setActiveModal(null);
					}}
				/>
			)}

			{activeModal === MODALS.UNSAVED_CHANGES && (
				<UnsavedChangesModal
					onSave={handleSaveAndContinue}
					onDiscard={handleDiscardAndContinue}
					onClose={handleCancel}
					canClose={false}
				/>
			)}
			{activeModal === MODALS.OPEN_PROJECT && (
				<OpenProjectModal
					isDirty={isDirty}
					onOpen={handleOpenProject}

					onClose={() => setActiveModal(null)}

					onProjectDeleted={handleProjectDeleted}
				/>
			)}
			{activeModal === MODALS.SAVE_PROJECT && (
				<SaveModal
					onSaveAs={(name, description) => {
						saveProjectAs(name, description);
						setActiveModal(null);
					}}

					onClose={() => setActiveModal(null)}
				/>
			)}

			{activeModal === MODALS.EXPORT && (
				<ExportModal
					featureLayers={filteredLayers}
					onClose={() => setActiveModal(null)}
				/>
			)}

			{activeModal === MODALS.LARGE_DATASET && (
				<LargeDatasetModal
					onConfirm={() => {
						if (!pendingLayer) return;
						commitLayer(pendingLayer);
						setPendingLayer(null);
						setActiveModal(null);
						clearStatus();
						setIsDirty(true);
					}}
					onDiscard={() => {
						setPendingLayer(null);
						setActiveModal(null);
						clearStatus();
					}}
				/>
			)}

			{activeModal === MODALS.HOW_TO && (
				<HowToModal onClose={() => setActiveModal(null)} />
			)}

			{activeModal === MODALS.ABOUT && (
				<AboutModal onClose={() => setActiveModal(null)} />
			)}

			{/* Main UI */}
			<header className="app-header">
				<Toolbar
					onOpenModal={setActiveModal}
					onNewWorkspace={handleNewWorkspace}
					canExport={hasFeatures}
					canSave={hasBoundary}
					onSave={saveCurrentProject}
					onFocus={() => setFocusTrigger((t) => t + 1)}
					isDirty={isDirty}
					boundaryName={boundaryName}
				/>
			</header>

			<div className="app-body">
				<div className="sidebar">
					<Sidebar
						boundaryData={boundaryData}
						featureLayers={featureLayers}

						activeDrawer={activeDrawer}
						setActiveDrawer={setActiveDrawer}
					/>
				</div>

				<Drawer
					hasBoundary={hasBoundary}
					activeDrawer={activeDrawer}
					setActiveDrawer={setActiveDrawer}

					featureLayers={featureLayers}
					activeLayer={activeLayer}
					setActiveLayer={setActiveLayer}
					handleAddLayer={handleAddLayer}

					updateLayer={updateLayer}
					toggleLayerVisibility={toggleLayerVisibility}
					renameLayer={renameLayer}

					updateLayerFilters={updateLayerFilters}

					selectedBoundaryKey={selectedBoundaryKey}

					loadBoundaryResults={loadBoundaryResults}
					handleSelectBoundary={handleSelectBoundary}
					boundaryResults={boundaryResults}

					featureOptions={FEATURE_OPTIONS}

					basemap={basemap}
					setBasemap={setBasemap}
					displayMode={displayMode}
					setDisplayMode={setDisplayMode}

					clearBoundaryResults={clearBoundaryResults}
					handleClearBoundary={handleClearBoundary}
					removeLayer={removeLayer}
					clearLayers={clearLayers}
					cachedFeatures={getCachedFeatures(selectedBoundaryKey)}
				/>

				<div className="main-content">
					{hasFeatures && displayMode === 'lastEdited' && <Legend />}

					<Map
						// boundary
						boundary={boundaryGeojson}
						boundaryKey={selectedBoundaryKey}

						// features
						featureLayers={filteredLayers}

						// display settings
						displayMode={displayMode}
						basemap={basemap}
						focusTrigger={focusTrigger}
					/>
				</div>
			</div>
		</div>
	);
}
