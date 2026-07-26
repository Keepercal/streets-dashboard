import { useMemo, useEffect, useState, useCallback } from "react";
import { saveSession, loadSession } from "../services/sessionService"
import { createProject } from "../models/project";

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
    projectInfo,
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
    const currentProject = useMemo(() =>
        createProject({

            metadata: {
                ...projectInfo,
                modified: new Date().toISOString(),
            },

            settings: {
                basemap,
                displayMode,
            },

            boundary,
            layers,
        }),
        [
            projectInfo,
            basemap,
            displayMode,
            boundary,
            layers,
        ]);

    // Load saved project from storage
    const restoreSession = useCallback(() => {

        const project = loadSession();

        // No saved project found
        if (!project) {
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
            saveSession(currentProject);
        }, 1000);

        return () => clearTimeout(timer);

    }, [
        currentProject,
        hydrated,
        restoring
    ]);

    // Manually save current project
    const saveProject = useCallback(() => {
        if (!hydrated || restoring) return;

        saveSession(currentProject);
    }, [currentProject, hydrated, restoring]);

    // Export project as a JSON file
    const saveProjectAs = useCallback(() => {

        const json = JSON.stringify(
            currentProject,
            null,
            2
        );

        const blob = new Blob(
            [json],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        const filename =
            currentProject.metadata.filename
                .replace(/[<>:"/\\|?*]+/g, "_")
                .trim();

        link.download = `${filename || "Untitled Project"}.json`

        link.click();

        URL.revokeObjectURL(url);

    }, [currentProject]);


    return {
        currentProject,

        restoreSession,

        saveProject,
        saveProjectAs,

        hydrated
    };
}