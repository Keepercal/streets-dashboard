const BRISTOL_WARDS = [
    "Ashley",
    "Bedminster",
    "Bishopston",
    "Brislington East",
    "Brislington West",
    "Cabot",
    "Clifton East",
    "Clifton",
    "Cotham",
    "Eastville",
    "Filwood",
    "Frome Vale",
    "Hartcliffe",
    "Henbury",
    "Hengrove",
    "Henleaze",
    "Hillfields",
    "Horfield",
    "Kingsweston",
    "Knowle",
    "Lockleaze",
    "Redland",
    "Southmead",
    "Southville",
    "St. George East",
    "St. George West",
    "Stockwood",
    "Stoke Bishop",
    "Westbury-on-Trym",
    "Whitchurch Park",
    "Windmill Hill"
];

/**
 * Converts a name into a URL-safe key
 */
const toSlug = (str) =>
    str
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // remove punctuation
        .replace(/\s+/g, "_");

/**
 * Convert wards into config entries
 */
const wardEntries = Object.fromEntries(
    BRISTOL_WARDS.map((name) => [
        toSlug(name),
        {
            boundaryType: "political",
            name: `${name} Ward`,
            label: name,
        },
    ])
);

/**
 * Master boundary registry
 */
export const BOUNDARY_MAP = {
    // -----------------------
    // ADMIN LEVEL 6
    // -----------------------
    bristol: {
        boundaryType: "administrative",
        name: "Bristol",
        label: "Bristol",
        id: "5746665",
    },

    somerset: {
        boundaryType: "administrative",
        name: "Somerset",
        label: "Somerset",
        id: "72894",
    },

    curry_rivel: {
        boundaryType: "administrative",
        name: "Curry Rivel",
        label: "Curry Rivel",
    },

    yeovil: {
        boundaryType: "administrative",
        name: "Yeovil",
        label: "Yeovil",
    },

    // -----------------------
    // ADMIN LEVEL 10 (wards)
    // -----------------------
    ...wardEntries,
};