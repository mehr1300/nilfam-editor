import {Colors} from "../../assets/data/Data.jsx";
import {PaletteIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";
import {useEffect, useRef, useState} from "react";
import {Configs} from "../config/Configs.js";

const TextColor = ({editor,lang}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="tw:relative" ref={containerRef}>
            <button className="class-button" title={t('textColor', lang)} onClick={toggleDropdown}>
                <PaletteIcon/>
            </button>

            {isOpen && (
                <div className={`${Configs.RtlLang.includes(lang) ? "tw:right-0" : "tw:left-0"} tw:absolute tw:top-8  tw:z-10`}>
                    <div className="tw:p-2 tw:bg-gray-200 tw:dark:bg-gray-800 tw:w-52 tw:flex tw:flex-col tw:rounded">
                        <div className="tw:flex tw:flex-row tw:justify-end tw:mb-2">
                            <button onClick={() => {
                                editor.chain().focus().setTextColor(null).run();
                            }} className="tw:bg-gray-300 tw:hover:bg-gray-400 tw:dark:bg-gray-600 tw:dark:hover:bg-gray-700 tw:text-sm tw:px-2 tw:py-1 tw:rounded tw:cursor-pointer">
                                {t('clear', lang)}
                            </button>
                        </div>
                        <div className="tw:grid tw:grid-cols-7 tw:gap-2 tw:pe-3 tw:h-52 tw:overflow-y-auto">
                            {Colors.map((color) => (
                                <span key={color} className="tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:cursor-pointer tw:w-5 tw:h-5 tw:rounded tw:hover:opacity-70" style={{backgroundColor: color}} onClick={() => {
                                    editor.chain().focus().setTextColor(color).run();
                                    setIsOpen(false);
                                }}/>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TextColor;
