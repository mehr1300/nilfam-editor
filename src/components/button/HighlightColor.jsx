import {Colors} from "../../assets/data/Data.jsx";
import {HighlightIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";
import {useEffect, useRef, useState} from "react";
import {Configs} from "../config/Configs.js";

const HighlightColor = ({ editor,lang}) => {
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
        <div className="relative" ref={containerRef}>
            <button className="class-button" title={t('highlightText', lang)} onClick={toggleDropdown}>
                <HighlightIcon/>
            </button>

            {isOpen && (
                <div className={`${Configs.RtlLang.includes(lang) ? "right-0" : "left-0"} absolute top-8  z-10`}>
                    <div className="p-2 bg-gray-200 w-52 flex flex-col rounded">
                        <div className="flex flex-row justify-end mb-2">
                            <button onClick={() => editor.chain().focus().unsetMark('highlight').run()}
                                    className="bg-gray-300 hover:bg-gray-400 text-sm px-2 py-1 rounded cursor-pointer">
                                {t('clear', lang)}
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 pe-3 h-52 overflow-y-auto">
                            {Colors.map((color) => (
                                <span key={color} className="border border-gray-300 cursor-pointer w-5 h-5 rounded hover:opacity-70" style={{backgroundColor: color}} onClick={() => {
                                    editor.chain().focus().toggleHighlight({color}).run()
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

export default HighlightColor;
