import "./LayerItem.css"
import { Eye, EyeOff, Trash2, Palette, Check, Pencil } from "lucide-react"
import { useState } from "react";

export default function LayerItem({
    featureLayers,
    toggleFeatureVisibility,
    updateLayer,
    removeFeature,
    renameLayer
}) {
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState("");

    const startEditing = (key, currentName) => {
        setEditing(key);
        setName(currentName);
    }

    const saveRename = (key) =>{
        const trimmedName = name.trim();

        if (trimmedName.length > 0){
            renameLayer(key, trimmedName)
        }

        setEditing(null);
        setName("")
    }

    return (
        <>
            {Object.entries(featureLayers).map(
                ([key, layer]) => (

                    <div
                        key={key}
                        className="layer-item"
                    >
                        <div className="layer-name">
                            {editing === key ? (

                                <input
                                    className="layer-name-input"
                                    value={name}
                                    autoFocus
                                    onChange={(event) => 
                                        setName(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            saveRename(key);
                                        }
                                        if (event.key === "Escape") {
                                            setEditing(null);
                                        }
                                    }}
                                />
                            ) : (
                                <span className="layer-name">
                                    {layer.displayName ?? key}
                                </span>
                            )}
                    </div>

                    <div className="layer-actions">
                        {/* Rename */}
                        {editing === key ? (
                            <button
                                className="layer-action-btn"
                                onClick={() => saveRename(key)}
                                title="Save name"
                            >
                                <Check size={22}/>
                            </button>
                        ) : (
                            <button
                                className="layer-action-btn"
                                onClick={() => 
                                    startEditing(
                                        key,
                                        layer.displayName ?? layer.label ?? key
                                    )
                                }
                                title="Rename layer"
                            >
                                <Pencil size={22}/>
                            </button>
                        )}

                        {/* Visibility */}
                        <button
                            className="layer-action-btn"
                            onClick={() => toggleFeatureVisibility(key)}
                            title={
                                layer.visible
                                    ? "Hide Layer"
                                    : "Show Layer"
                            }
                        >
                            {layer.visible
                                ? <Eye size={22} />
                                : <EyeOff size={22} />
                            }
                        </button>

                        {/* Colour */}
                        <div
                            className="colour-swatch"
                            style={{
                                backgroundColor: layer.colour ?? "#3388ff"
                            }}
                        >
                            <input
                                type="color"
                                value={layer.colour ?? "#3388ff"}
                                onChange={(event) =>
                                    updateLayer(key, {
                                            colour: event.target.value
                                        }
                                    )
                                }
                                onBlur={(event) => event.target.blur()}
                            />

                        </div>
                        
                        {/* Delete */}
                        <button
                            className="layer-action-btn delete"
                            onClick={() => removeFeature(key)}
                            title="Delete layer"
                        >
                            <Trash2 size={22}/>
                        </button>
                    
                    </div>
                </div>

                ))
            }
        </>
    );
}