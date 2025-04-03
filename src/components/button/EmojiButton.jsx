import { useState, useEffect, useRef } from "react";
import { EmojiIcon } from "../../assets/icons/Icons.jsx";
import { Emoji } from "../../assets/data/Data.jsx";
import { t } from "../Lang/i18n.js";
import {Configs} from "../config/Configs.js";

const EmojiButton = ({ editor, lang }) => {
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
            <button className="class-button" title={t('emoji', lang)} onClick={toggleDropdown}>
                <EmojiIcon />
            </button>
            {isOpen && (
                <div className={`${Configs.RtlLang.includes(lang) ? "right-0" : "left-0"} absolute top-8 z-10`}>
                    <div className="p-2 bg-gray-200 w-60 flex flex-col rounded">
                        <div className="grid grid-cols-8 gap-2 pe-3 h-52 overflow-y-auto">
                            {Emoji.map((emojiCode, index) => (
                                <span
                                    key={index}
                                    onClick={() => {
                                        editor.chain().focus().insertContent(String.fromCodePoint(emojiCode)).run();
                                        setIsOpen(false);
                                    }}
                                    className="text-lg hover:opacity-50 cursor-pointer">
                                    {String.fromCodePoint(emojiCode)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiButton;
