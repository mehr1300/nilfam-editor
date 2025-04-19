// src/components/BoxButton.jsx
import { Colors } from '../../assets/data/Data.jsx';
import { t } from '../Lang/i18n.js';
import { useEffect, useRef, useState } from 'react';
import { Configs } from '../config/Configs.js';

const BoxButton = ({ editor, lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [borderRadius, setBorderRadius] = useState('4px');
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const applyBox = () => {
        if (editor) {
            editor
                .chain()
                .focus()
                .setColoredBox({
                    backgroundColor: selectedColor,
                    borderRadius: borderRadius,
                })
                .run();
            setIsOpen(false);
        }
    };

    const removeBox = () => {
        if (editor) {
            editor.chain().focus().unsetColoredBox().run();
            setIsOpen(false);
        }
    };

    return (
        <div className="tw:relative" ref={containerRef}>
            ssss
            <div
                className="class-button"
                title={t('coloredBox', lang)}
                onClick={toggleDropdown}
            >
                <span className="tw-w-5 tw-h-5 tw-rounded tw-border tw-border-gray-300" style={{ backgroundColor: selectedColor }} />
            </div>

            {isOpen && (
                <div className={`${Configs.RtlLang.includes(lang) ? 'tw:right-0' : 'tw:left-0'} tw:absolute tw:top-8 tw:z-10`}>
                    <div className="tw:p-2 tw:bg-gray-200 tw:dark:bg-gray-700 tw:w-64 tw:flex tw:flex-col tw:rounded">
                        <div className="tw:flex tw:flex-row tw:justify-end tw:mb-2">
                            <div onClick={removeBox} className="tw:bg-gray-300 tw:hover:bg-gray-400 tw:dark:bg-gray-500 tw:dark:hover:bg-gray-600 tw:text-sm tw:px-2 tw:py-1 tw:rounded tw:cursor-pointer">
                                {t('clear', lang)}
                            </div>
                        </div>

                        {/* انتخاب رنگ */}
                        <div className="tw:mb-4">
                            <label className="tw:text-sm tw:mb-1 tw:block">{t('backgroundColor', lang)}</label>
                            <div className="tw:grid tw:grid-cols-7 tw:gap-2 tw:pe-3">
                                {Colors.map((color) => (
                                    <span
                                        key={color}
                                        className="tw:border tw:border-gray-300 tw:dark:border-gray-600 tw:cursor-pointer tw:w-5 tw:h-5 tw:rounded tw:hover:opacity-70"
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* انتخاب شعاع گوشه‌ها */}
                        <div className="tw:mb-4">
                            <label className="tw:text-sm tw:mb-1 tw:block">{t('borderRadius', lang)}</label>
                            <select
                                value={borderRadius}
                                onChange={(e) => setBorderRadius(e.target.value)}
                                className="tw:w-full tw:p-1 tw:rounded tw:bg-gray-100 tw:dark:bg-gray-600"
                            >
                                <option value="0px">0px</option>
                                <option value="4px">4px</option>
                                <option value="8px">8px</option>
                                <option value="12px">12px</option>
                                <option value="16px">16px</option>
                            </select>
                        </div>

                        {/* دکمه اعمال */}
                        <div className="tw:flex tw:justify-end">
                            <button onClick={applyBox} className="tw:bg-blue-500 tw:hover:bg-blue-600 tw:text-white tw:text-sm tw:px-3 tw:py-1 tw:rounded tw:cursor-pointer">
                                {t('apply', lang)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoxButton;
