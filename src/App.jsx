/**
 * App Entry Point
 * -----------
 * npm run dev: Local development server
 * npm run deploy: Builds and deploys to GitHub Pages
 */

import { createRoot } from 'react-dom/client';
import { useMemo, useEffect, useState, useRef } from 'react';
import './App.css';

/* High level components */
import Map from './layout/Map/Map.jsx';
import Toolbar from './layout/Toolbar/Toolbar';
import Sidebar from './layout/Sidebar/Sidebar';
import Drawer from './layout/Drawer/Drawer';

/* Popups/Panels */
import StatusPopup from './layout/Popups/StatusPopup/StatusPopup.jsx';
import ExportModal from './layout/Modals/ExportModal/ExportModal.jsx';
import NewProjectModal from './layout/Modals/NewProjectModal/NewProjectModal.jsx';
import OpenProjectModal from './layout/Modals/OpenProjectModal/OpenProjectModal.jsx';
import SaveModal from './layout/Modals/SaveModal/SaveModal.jsx';

/* Map related components */
import Legend from './components/Legend/Legend.jsx';

/* Hooks */
import useBoundarySearch from './hooks/useBoundarySearch.js';
import useBoundaryData from './hooks/useBoundaryData.js';
import useMapFeatures from './hooks/useMapFeatures.js';
import useFilteredLayers from './hooks/useFilteredLayers.js';
import useStatusPopup from './hooks/useStatusPopup.js';
import useSession from './hooks/useSession.js';
import useProjectManager from './hooks/useProjectManager.js';

/* Misc imports */
import { FEATURE_OPTIONS } from './config/featureOptions.js';
import { createSession } from './models/session.js';
import { isProjectSession } from './utils/sessionUtils';

import { getProject } from './db/projectDB.js';
import RestoreSessionModal from './layout/Modals/RestoreSessionModal/RestoreSessionModal.jsx';

export default function App() {
	const MODALS = {
		EXPORT: 'export',
		NEW_PROJECT: 'new-project',
		SAVE_PROJECT: 'save-project',
		OPEN_PROJECT: 'open-project',
		RESTORE_SESSION: 'restore-session',
	};

	/* UI STATES */
	const [pendingSession, setPendingSession] = useState(null);
	const [activeDrawer, setActiveDrawer] = useState(null); // which drawer is open
	const [activeLayer, setActiveLayer] = useState(null); // which layer the user is inspecting
	const [activeModal, setActiveModal] = useState(null);

	const [basemap, setBasemap] = useState('carto');
	const [displayMode, setDisplayMode] = useState('default'); // or by last edit

	/* DATA STATES */
	const [sessionInfo, setSessionInfo] = useState(createSession());
	const [selectedBoundaryKey, setSelectedBoundaryKey] = useState('none');

	const { loadBoundaryResults, boundaryResults, clearBoundaryResults } =
		useBoundarySearch();

	const {
		// boundary data
		boundaryData,
		boundaryGeojson,
		boundaryName = boundaryData?.elements?.[0]?.tags?.name ?? 'None',

		// boundary handling
		loadBoundary,
		clearBoundary,

		//exportBoundary,
		restoreBoundary,

		// status
		status: boundaryStatus,
		error: boundaryError,
	} = useBoundaryData({
		onChange: () => setIsDirty(true),
	});

	/* Hook in feature data */
	const {
		//state
		featureLayers,

		// data operations
		loadFeatures,
		clearFeatures,
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
		status: featureStatus,
		error: featureError,
	} = useMapFeatures({
		onChange: () => setIsDirty(true),
	});

	const { statusPopup, dismissPopup } = useStatusPopup({
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
		clearFeatures();
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
	const handleAddLayer = (
		featureKey,
		featureTag,
		featureValue,
		featureType,
		featureLabel
	) => {
		console.log('[DEBUG] handleAddLayer ENTER:', {
			featureKey,
			featureTag,
			featureValue,
			featureType,
			featureLabel,
			selectedBoundaryKey,
		});

		loadFeatures({
			featureKey,
			boundaryKey: selectedBoundaryKey,
			featureTag,
			featureValue,
			featureType,
			featureLabel,
		});

		setIsDirty(true);
	};

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

		if (session.projectId) {
			const project = await getProject(session.projectId);

			if (project) {
				setProject(project);
			}
		}

		restoreWorkspaceSettings(session.data);

		const data = session.data ?? {};

		restoreBoundary(data.boundary);
		restoreLayers(data.layers ?? []);

		setIsDirty(false);
	}

	/*
	 * Helper to restore workspace settings
	 */
	function restoreWorkspaceSettings(data) {
		setBasemap(data.settings?.basemap ?? 'carto');
		setDisplayMode(data.settings?.displayMode ?? 'default');
		setSelectedBoundaryKey(data.boundary?.selectedBoundaryKey ?? 'none');
	}

	/*
	 * Creates a blank workspace
	 */
	const resetWorkspace = () => {
		console.log('[DEBUG] Creating empty session');

		setProject(null);
		setIsDirty(false);

		setSessionInfo(createSession());

		clearBoundaryResults();
		clearBoundary();
		clearFeatures();
		clearCache();

		setSelectedBoundaryKey('none');

		setBasemap('carto');
		setDisplayMode('default');

		setActiveDrawer(null);
		setActiveModal(null);
	};

	const handleSaveAndNewSession = async () => {
		await saveCurrentProject();
		resetWorkspace();
	};

	function handleProjectDeleted(id) {
		if (project?.metadata.id !== id) return;

		console.log('[DEBUG] Deleted active project');

		resetWorkspace();
	}

	/*
	 *Handles sessions
	 */
	const sessionManager = useSession({
		sessionInfo,

		basemap,
		displayMode,

		boundary: boundaryState,

		layers: exportLayers(),

		//onRestore: restoreSession,
		onRestore: (session) => {
			setPendingSession(session);
			setActiveModal(MODALS.RESTORE_SESSION);
		},
	});

	// Restore session on refresh
	useEffect(() => {
		if (didRestore.current) return;

		didRestore.current = true;

		sessionManager.restoreSavedSession();
	}, [sessionManager]);

	/* FLAGS */
	const [isDirty, setIsDirty] = useState(false);
	const hasBoundary = Object.keys(boundaryData ?? {}).length > 0; // Flag to check if boundary exists
	const hasFeatures = Object.keys(featureLayers).length > 0; // Flag to check if features exist
	const filteredLayers = useFilteredLayers(featureLayers);
	const didRestore = useRef(false);

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

	return (
		<div className="App">
			{/* Popups */}
			<StatusPopup
				trigger={statusPopup.trigger}
				type={statusPopup.type}
				title={statusPopup.title}
				message={statusPopup.message}
				onClose={() => {
					console.log('[DEBUG] Popup closed:', statusPopup);

					dismissPopup();

					if (statusPopup.source === 'boundary') {
						console.log('[DEBUG] Resetting boundary state');
						handleClearBoundary();
					}

					if (statusPopup.source === 'feature') {
						const failedKey = statusPopup.featureKey;
						console.log('[DEBUG] Removing failed feature');

						if (failedKey) {
							removeLayer(failedKey);
						}
					}
				}}
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

						console.log(
							'[DEBUG] Session after clearing:',
							localStorage.getItem('osm-project-session')
						);

						resetWorkspace();

						setPendingSession(null);
						setActiveModal(null);
					}}

					onClose={() => {
						setPendingSession(null);
						setActiveModal(null);
					}}
				/>
			)}

			{activeModal === MODALS.NEW_PROJECT && (
				<NewProjectModal
					isDirty={isDirty}
					onConfirm={resetWorkspace}
					onSaveAndConfirm={handleSaveAndNewSession}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal === MODALS.OPEN_PROJECT && (
				<OpenProjectModal
					isDirty={isDirty}
					onOpen={(projectId) => {
						openProject(projectId, restoreSession);
						setActiveModal(null);
					}}

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

			{/* Main UI */}
			<header className="app-header">
				<Toolbar
					onOpenModal={setActiveModal}
					canExport={hasFeatures}
					canSave={hasBoundary}
					onSave={saveCurrentProject}
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
					clearFeatures={clearFeatures}
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
					/>
				</div>
			</div>
		</div>
	);
}

createRoot(document.getElementById('root')).render(<App />);
