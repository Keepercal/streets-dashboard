import './Toolbar.css';
import { useState, useRef, useEffect } from 'react';

import ToolbarBrand from './components/ToolbarBrand/ToolbarBrand';
import ToolbarDropdown from './components/ToolbarDropdown/ToolbarDropdown';
import ToolbarButton from './components/ToolbarButton/ToolbarButton';
import BoundaryIndicator from '../../components/BoundaryIndicator/BoundaryIndicator';

import { Download, CirclePlus } from "lucide-react"

export default function Toolbar({ onOpenModal, canExport, boundaryName }) {

    const [openMenu, setOpenMenu] = useState(null);
    const toolbarRef = useRef(null);

    /* Closes dropdown menu when user clicks anywhere on screen */
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                toolbarRef.current &&
                !toolbarRef.current.contains(event.target)
            ) {
                setOpenMenu(null);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const menus = [
        {
            id: "file",
            title: "File",
            items: [
                /*{
                    id: "export",
                    label: "Export",
                    disabled: !canExport,
                    action: () => onOpenModal("export"),
                },*/
                {
                    id: "new",
                    label: "New Project",
                    icon: "CirclePlus",
                    disabled: true,
                    action: () => onOpenModal("new"),
                },
                {
                    id: "open",
                    label: "Open",
                    disabled: true,
                    action: () => onOpenModal("open"),
                },
                {
                    id: "save",
                    label: "Save",
                    disabled: true,
                    action: () => onOpenModal("save"),
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
                    action: () => onOpenModal("about")
                },
            ],
        },
    ];

    return (
        <div className="toolbar">
            <ToolbarBrand />

            <div
                className="toolbar-content"
                ref={toolbarRef}
            >
                <ToolbarButton
                    title="Export"
                    icon={<Download size={18}/>}
                    disabled={!canExport}
                    onClick={() => onOpenModal("export")}
                />
                {menus.map(menu => (
                    <ToolbarDropdown
                        key={menu.id}
                        title={menu.title}
                        icon={<CirclePlus size={18}/>}
                        items={menu.items}
                        isOpen={openMenu === menu.id}
                        onToggle={() =>
                            setOpenMenu(openMenu === menu.id ? null : menu.id)
                        }
                        onItemClick={(item) => {
                            item.action();
                            setOpenMenu(null);
                        }}
                    />
                ))}
            </div>

            <div className="toolbar-actions">
                <BoundaryIndicator
                    boundaryName={boundaryName}
                />
                <a
                    href="https://github.com/Keepercal/streets-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                    aria-label='Open GitHub repository'
                >
                    <img
                        src='./github-mark.svg'
                        alt='GitHub'
                    />
                </a>
            </div>
        </div>
    );
}