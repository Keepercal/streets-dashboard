import './NewProjectModal.css'
import { useState } from "react";

import Modal from "../Modal"

export default function NewProjectModal ({
    onClose,
    onCreate
}) {
    const [projectName, setProjectName] = useState("");

    const handleCreate = () => {
        const name = projectName.trim() || "Untitled Project";

        onCreate(name);
        onClose();
    }

    return (
        <Modal 
            title="New Project"
            onClose={onClose}
        >
            <section className="project-section">
                <h3>Project Details</h3>

                <label>
                    Project Name
                </label>

                <input
                    type="text"
                    value={projectName}
                    placeholder="Untitled Project"
                    onChange={(e) => 
                        setProjectName(e.target.value)
                    }
                />
            </section>

            <section className="project-actions">
                <button
                    className="secondary-btn"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    className="primary-btn"
                    onClick={handleCreate}
                >
                    Create Project
                </button>
            </section>
        </Modal>
    )
}