// src/components/button/ColoredBoxButton.jsx
import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../assets/data/Data.jsx';
import { t } from '../Lang/i18n.js';
import { Configs } from '../config/Configs.js';
import {ColorBoxIcon} from "../../assets/icons/Icons.jsx";

const ColoredBoxButton = ({ editor, lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [borderRadius, setBorderRadius] = useState(4);
    const [paddingBox, setPaddingBox] = useState(8);
    const containerRef = useRef(null);

    /* --- هندل‌های کمکی --- */
    useEffect(() => {
        const handleClickOutside = e => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyBox = () => {
        if (!editor) return;
        editor
            .chain()
            .focus()
            .setColoredBox({
                backgroundColor: selectedColor,
                borderRadius  : `${borderRadius}px`,
                paddingBox  : `${paddingBox}px`,
            }) // ← همان نام کامند جدید
            .run();
        setIsOpen(false);
    };

    const removeBox = () => {
        if (!editor) return;
        editor.chain().focus().unsetColoredBox().run();
        setIsOpen(false);
    };

    /* --- UI --- */
    return (
        <div className="tw:relative" ref={containerRef}>
            <div
                className="class-button"
                title={t('coloredBox', lang)}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <ColorBoxIcon/>
            </div>

            {isOpen && (
                <div className={`${Configs.RtlLang.includes(lang) ? 'tw:right-0' : 'tw:left-0'} tw:absolute tw:top-8 tw:z-10`}>
                    <div className="tw:p-2 tw:bg-gray-200 tw:dark:bg-gray-700 tw:w-52 tw:flex tw:flex-col tw:gap-1 tw:rounded">
                        {/* دکمه حذف */}
                        <div className="tw:flex tw:justify-end ">
                            <div onClick={removeBox} className="tw:add-font tw:bg-gray-300 tw:hover:bg-gray-400 tw:dark:bg-gray-500 tw:dark:hover:bg-gray-600 tw:text-sm tw:px-2 tw:py-1 tw:rounded">
                                {t('clear', lang)}
                            </div>
                        </div>

                        <div>
                            <label className="tw:text-sm tw:mb-1">{t('borderRadius', lang)}(px)</label>
                            <input value={borderRadius} type="text" onChange={e => setBorderRadius(e.target.value)} className="  tw:text-gray-800 tw:dark:text-gray-300 tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:px-1"/>
                        </div>
                        <div>
                            <label className="tw:text-sm tw:mb-1">{t('paddingBox', lang)}(px)</label>
                            <input value={paddingBox} type="text" onChange={e => setPaddingBox(e.target.value)} className="  tw:text-gray-800 tw:dark:text-gray-300 tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:px-1"/>
                        </div>


                        <div>
                            <label className="tw:text-sm tw:mb-1">{t('selectColor', lang)}</label>
                            <div className="tw:grid tw:grid-cols-7 tw:gap-2 tw:pe-3 tw:h-40 tw:overflow-y-auto">
                                {Colors.map(color => (
                                    <span key={color} onClick={() => setSelectedColor(color)} className={`${selectedColor === color ? "tw:border-3 tw:border-blue-500 tw:dark:border-gray-200" : "tw:border tw:border-gray-300  tw:dark:border-gray-600"}   tw:cursor-pointer tw:w-5 tw:h-5 tw:rounded tw:hover:opacity-70`} style={{backgroundColor: color}}/>
                                ))}
                            </div>
                        </div>

                        <div className="tw:flex tw:justify-end tw:mt-2">
                            <div onClick={applyBox} className="add-font tw:flex tw:flex-row tw:justify-center tw:items-center tw:h-8 tw:cursor-pointer tw:bg-blue-500 tw:hover:bg-blue-600 tw:text-white tw:text-sm tw:px-3  tw:rounded">
                                {t('add', lang)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColoredBoxButton;
