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
        <div className="tw:relative" ref={containerRef}>
            <div className="class-button" title={t('emoji', lang)} onClick={toggleDropdown}>
                <EmojiIcon />
            </div>
            {isOpen && (
                <div className={`${Configs.RtlLang.includes(lang) ? "tw:right-0" : "tw:left-0"} tw:absolute tw:top-8 tw:z-10`}>
                    <div className="tw:p-2 tw:bg-gray-200 tw:dark:bg-gray-700 tw:w-60 tw:flex tw:flex-col tw:rounded">
                        <div className="tw:grid tw:grid-cols-8 tw:gap-2 tw:pe-3 tw:h-52 tw:overflow-y-auto">
                            {Emoji.map((emojiCode, index) => (
                                <span
                                    key={index}
                                    onClick={() => {
                                        editor.chain().focus().insertContent(String.fromCodePoint(emojiCode)).run();
                                        setIsOpen(false);
                                    }}
                                    className="tw:text-lg tw:hover:opacity-50 tw:cursor-pointer">
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
