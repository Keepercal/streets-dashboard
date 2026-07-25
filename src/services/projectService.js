const AUTOSAVE_KEY = "osm-project-autosave";

/**
 * Save project to local storage
 */
export function saveAutosave(project) {

    localStorage.setItem(
        AUTOSAVE_KEY,
        JSON.stringify(project)
    );
}

/**
 * Load saved project from local storage
 */
export function loadAutosave() {

    const json = localStorage.getItem(AUTOSAVE_KEY);

    // No saved project exists
    if (!json) {
        return null;
    }

    try {

        return JSON.parse(json);

    } catch (error) {

        console.error(
            "[DEBUG] Failed to load autosave:",
            error
        );

        return null;
    }
}

/**
 * Remove saved project
 */
export function clearAutosave() {
    
    localStorage.removeItem(
        AUTOSAVE_KEY
    );
}