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
]

const toSnakeCase = (str) =>
  str
    .toLowerCase()
    .replace(/[.-]/g, " ")
    .replace(/\s+/g, "_");

const wardEntries = Object.fromEntries(
    BRISTOL_WARDS.map((name) => [
        toSnakeCase(name),
        {
            boundary_type: "political",
            name: `${name} Ward`,
            label: name,
        },
    ])
);

export const BOUNDARY_MAP = {
    // ADMIN LEVEL 6
    bristol: {
        boundary_type: 'administrative',
        name: 'City of Bristol',
        label: 'Bristol',
    },

    curry_rivel: {
        boundary_type: 'administrative',
        name: 'Curry Rivel',
        label: 'Curry Rivel'
    },

    // ADMIN LEVEL 10
    ...wardEntries,
}