import { useMemo, useEffect, useState, useCallback } from "react";
import {
    saveAutosave,
    loadAutosave
} from "../services/projectService"

/**
 * useProject
 * -----------
 * Handles project saving and loading.
 *
 * Includes:
 * - autosave
 * - restore
 * - manual save
 */
export default function useProject({
    basemap,
    displayMode,
    boundary,
    layers,
    onRestore
}) {

    // Prevent autosave until the initial project load is complete
    const [hydrated, setHydrated] = useState(false);

    // Prevent autosave while restoring a project
    const [restoring, setRestoring] = useState(false);

    // Create the current project as an object
    const currentProject = useMemo(() => ({
        version: 1,

        settings: {
            basemap,
            displayMode,
        },

        boundary,

        layers,

    }), [
        basemap,
        displayMode,
        boundary,
        layers
    ]);

    // Load saved project from storage
    const restoreAutosave = useCallback(() => {

        const project = loadAutosave();

        // No saved project found
        if (!project){
            setHydrated(true);
            return false;
        }

        setRestoring(true);

        // Send project data back to App
        onRestore?.(project);

        // Enable autosave after restore finishes
        setTimeout(() => {
            setRestoring(false)
            setHydrated(true);
        }, 0)

        return true;

    }, [onRestore]);

    // Automatically save changes after a short delay
    useEffect(() => {

        if (!hydrated || restoring) return;

        const timer = setTimeout(() => {
            saveAutosave(currentProject);
        }, 1000);

        return () => clearTimeout(timer);

    }, [
        currentProject,
        hydrated,
        restoring
    ]);

    // Manually save current project
    const saveProject = useCallback(() => {
        saveAutosave(currentProject);
    }, [currentProject]);

    // Export project as a JSON file
    const saveProjectAs = useCallback(() => {

        const json = JSON.stringify(
            currentProject,
            null,
            2
        );

        const blob = new Blob(
            [json],
            {type:"application/json"}
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "project.json";

        link.click();

        URL.revokeObjectURL(url);

    }, [currentProject]);


    return {
        currentProject,

        restoreAutosave,

        saveProject,
        saveProjectAs,

        hydrated
    };
}