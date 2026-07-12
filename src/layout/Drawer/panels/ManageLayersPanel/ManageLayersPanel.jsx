import "./ManageLayersPanel.css"

export default function ManageLayersPanel({
    featureLayers,
    toggleFeatureVisibility,
    updateLayer,
    removeFeature,
}) {

    return (
        <div>

            {Object.entries(featureLayers).map(
                ([key, layer]) => (

                <div 
                    key={key}
                    className="layer-item"
                >

                    <label>
                        <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={() =>
                                toggleFeatureVisibility(key)
                            }
                        />

                        {layer.label ?? key}
                    </label>

                    <input
                        type="color"
                        value={layer.colour ?? "#3388ff"}
                        onChange={(event) =>
                            updateLayer(
                                key,
                                {
                                    colour: event.target.value
                                }
                            )
                        }
                    />

                    <button
                        onClick={() => removeFeature(key)}
                    >
                        Delete

                    </button>


                </div>

            ))}

        </div>
    );
}