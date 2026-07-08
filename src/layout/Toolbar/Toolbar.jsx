import './Toolbar.css';
import { useState, useRef, useEffect } from 'react';

import ToolbarBrand from './ToolbarBrand';
import Dropdown from './Dropdown';

export default function Toolbar(){

    const [openMenu, setOpenMenu] = useState(null);
    const toolbarRef = useRef(null);

    /* Closes dropdown menu when user clicks anywhere on screen */
    useEffect(() => {
        function handleClickOutside(event){
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
                //{ id: "new", label: "New"},
                //{ id: "open", label: "Open"},
                //{ id: "save", label: "Save"},
                { id: "export", label: "Export"}
            ],
        },
        {
            id: "help",
            title: "Help",
            items: [
                { id: "about", label: "About"},
            ],
        },
    ];

    return (
        <div className="toolbar">
            <ToolbarBrand/>

            <div 
                className="toolbar-content"
                ref={toolbarRef}
            >
                {menus.map(menu => (
                    <Dropdown
                        key={menu.id}
                        title={menu.title}
                        items={menu.items}
                        isOpen={openMenu === menu.id}
                        onToggle={() =>
                            setOpenMenu(
                                openMenu === menu.id 
                                    ? null 
                                    : menu.id
                            )
                        }
                    />
                ))}
            </div>

            <div className="toolbar-actions">
                <a
                    href="https://github.com/Keepercal/streets-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                    aria-label='Open GitHub repository'
                >
                    <img
                        src='./public/github-mark.svg'
                        alt='GitHub'
                    />
                </a>
            </div>
        </div>
    );
}