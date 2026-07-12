const colours = [
    "#e63946",
    "#457b9d",
    "#2a9d8f",
    "#f4a261",
    "#9b5de5",
    "#f15bb5",
    "#00bbf9",
    "#00f5d4",
    "#ffbe0b",
    "#fb5607",
];

const layerColours = new Map();

export default function getLayerColour(key) {
    if (!layerColours.has(key)) {
        const randomColour =
            colours[Math.floor(Math.random() * colours.length)];

        layerColours.set(key, randomColour);
    }

    return layerColours.get(key);
}