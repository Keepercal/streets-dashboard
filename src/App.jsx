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

/* Misc imports */
import { FEATURE_OPTIONS } from './config/featureOptions.js';
import { createProject } from './models/project';
import { createSession } from './models/session.js';
import { isProjectSession } from './utils/sessionUtils';

import { saveProject as saveProjectToDB, getProject } from './db/projectDB.js';

export default function App() {
	const MODALS = {
		EXPORT: 'export',
		NEW_PROJECT: 'new-project',
		SAVE_PROJECT: 'save-project',
		OPEN_PROJECT: 'open-project',
	};

	/* UI STATES */
	const [activeDrawer, setActiveDrawer] = useState(null); // which drawer is open
	const [activeLayer, setActiveLayer] = useState(null); // which layer the user is inspecting
	const [activeModal, setActiveModal] = useState(null);

	const [basemap, setBasemap] = useState('carto');
	const [displayMode, setDisplayMode] = useState('default'); // or by last edit

	/* DATA STATES */
	const [sessionInfo, setSessionInfo] = useState(createSession());
	const [project, setProject] = useState(null);
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
	const handleClearBoundaryResults = () => {
		clearBoundaryResults();
	};

	/**
	 * Handle resetting boundary and wiping features
	 */
	const handleClearBoundary = () => {
		setSelectedBoundaryKey('none');
		clearBoundary();
		clearFeatures();
		//clearCache();
	};

	/* Handle renaming features */
	const renameLayer = (layerID, newLabel) => {
		console.log('[DEBUG] renameLayer ENTER:', layerID, newLabel);
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
	 * Loads a restored project back onto the map and configures the application settings
	 */
	function restoreSession(session) {
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

		const data = session.data ?? {};

		setBasemap(data.settings?.basemap ?? 'carto');

		setDisplayMode(data.settings?.displayMode ?? 'default');

		setSelectedBoundaryKey(data.boundary?.selectedBoundaryKey ?? 'none');

		restoreBoundary(data.boundary);

		restoreLayers(data.layers ?? []);
	}

	/*
	 * Creates a blank session
	 */
	const handleNewSession = () => {
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

	async function handleOpenProject(projectId) {
		const project = await getProject(projectId);

		if (!project) {
			console.error('Project not found');
			return;
		}

		console.log('[DEBUG] Opening project:', project);

		setProject(project);

		restoreSession({
			projectId: project.metadata.id,
			data: {
				settings: project.settings,
				boundary: project.boundary,
				layers: project.layers,
			},
		});

		setIsDirty(false);
	}

	/*
	 * Saves the current project
	 */
	async function saveCurrentProject() {
		if (!project) {
			console.log('[DEBUG] No existing project, opening Save As');
			setActiveModal(MODALS.SAVE_PROJECT);
			return;
		}

		const updatedProject = {
			...project,

			metadata: {
				...project.metadata,
				modified: new Date().toISOString(),
			},

			settings: {
				basemap,
				displayMode,
			},

			boundary: {
				selectedBoundaryKey,
				data: boundaryData,
				geojson: boundaryGeojson,
			},

			layers: exportLayers(),
		};

		await saveProjectToDB(updatedProject);

		console.log('[DEBUG] Saving project', updatedProject);

		setProject(updatedProject);
		setIsDirty(false);

		console.log('[DEBUG] Project saved:', project);
	}

	/*
	 * Creates a brand new project
	 */
	async function saveProjectAs(name, description) {
		const newProject = createProject({
			metadata: {
				name,
				description,
			},

			settings: {
				basemap,
				displayMode,
			},

			boundary: {
				selectedBoundaryKey,
				data: boundaryData,
				geojson: boundaryGeojson,
			},

			layers: exportLayers(),
		});

		await saveProjectToDB(newProject);

		console.log('[DEBUG] Saving project', newProject);

		setProject(newProject);

		// Link the current session to this project
		setSessionInfo((prev) => ({
			...prev,
			projectId: newProject.metadata.id,
			modified: new Date().toISOString(),
		}));

		setIsDirty(false);

		console.log('[DEBUG] Project saved:', project);
	}

	function handleProjectDeleted(id) {
		if (project?.metadata.id !== id) return;

		console.log('[DEBUG] Deleted active project, clearing session');

		setProject(null);

		setSessionInfo(createSession());

		clearBoundaryResults();
		clearBoundary();
		clearFeatures();
		clearCache();

		setSelectedBoundaryKey('none');

		setBasemap('carto');
		setDisplayMode('default');

		setIsDirty(false);
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

		onRestore: restoreSession,
	});

	// Restore session on refresh
	useEffect(() => {
		if (didRestore.current) return;

		didRestore.current = true;

		sessionManager.restoreSession();
	}, [sessionManager]);

	/* FLAGS */
	const [isDirty, setIsDirty] = useState(false);
	const hasBoundary = Object.keys(boundaryData ?? {}).length > 0; // Flag to check if boundary exists
	const hasFeatures = Object.keys(featureLayers).length > 0; // Flag to check if features exist
	const filteredLayers = useFilteredLayers(featureLayers);
	const didRestore = useRef(false);

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
			{activeModal === MODALS.NEW_PROJECT && (
				<NewProjectModal
					onCreate={handleNewSession}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal === MODALS.OPEN_PROJECT && (
				<OpenProjectModal
					onOpen={(projectId) => {
						handleOpenProject(projectId);
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

					handleClearBoundaryResults={handleClearBoundaryResults}
					handleClearBoundary={handleClearBoundary}
					removeLayer={removeLayer}
					clearFeatures={clearFeatures}
					cachedFeatures={getCachedFeatures(selectedBoundaryKey)}
				/>

				<div className="main-content">
					{hasFeatures && displayMode === 'lastEdited' && <Legend />}

					<Map
						boundary={boundaryGeojson}
						featureLayers={filteredLayers}
						displayMode={displayMode}
						basemap={basemap}
					/>
				</div>
			</div>
		</div>
	);
}

createRoot(document.getElementById('root')).render(<App />);
