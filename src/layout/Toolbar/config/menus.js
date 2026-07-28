import { CirclePlus } from "lucide-react"

/* Config object */
export const menus = [
    {
        id: "file",
        title: "File",
        items: [
            {
                id: "new-project",
                label: "New Project",
                icon: CirclePlus,
                modal: "new-project",
            },
            {
                id: "save",
                label: "Save",
                modal : "save",
                disabled: true,
            },
            {
                id: "open",
                label: "Open",
                modal: "open",
                disabled: true,
            },
        ],
    },
    {
        id: "help",
        title: "Help",
        items: [
            {
                id: "about",
                label: "About",
                disabled: true,
                modal: "about"
            },
        ],
    },
];