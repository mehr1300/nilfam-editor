import {t} from "../Lang/i18n.js";
import {LinkIcon, XIcon} from "../../assets/icons/Icons.jsx";
import {useEffect, useState} from "react";
import {Configs} from "../config/Configs.js";

const LinkButton = ({editor, lang}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState('');

    const showLink = () => {
        const previousUrl = editor.getAttributes('link').href || '';
        setValue(previousUrl);
        setIsModalOpen(true);
    };

    const addLink = () => {
        if (!value) {
            // اگر مقدار خالی بود، لینک را حذف کن
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setIsModalOpen(false);
            return;
        }
        const attrs = {href: value};
        if (!value.startsWith('#') && !value.startsWith('/')) {
            attrs.target = '_blank';
            attrs.rel = 'noopener noreferrer nofollow';
        }
        editor.chain().focus().extendMarkRange('link').setLink(attrs).run();
        setIsModalOpen(false);
    };

    // این useEffect برای به‌روزرسانی مقدار value هنگامی که لینک در ادیتور تغییر می‌کند
    useEffect(() => {
        const updateLink = () => {
            if (editor.isActive('link')) {
                const url = editor.getAttributes('link').href;
                if (url !== value) {
                    setValue(url);
                }
            } else if (value !== '') {
                setValue('');
            }
        };

        editor.on('selectionUpdate', updateLink);
        editor.on('transaction', updateLink);

        return () => {
            editor.off('selectionUpdate', updateLink);
            editor.off('transaction', updateLink);
        };
    }, [editor, value]);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '17px';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
        }
    }, [isModalOpen]);

    return (
        <div>
            <div className="class-button tw:data-active:bg-gray-300 tw:dark:data-active:bg-gray-700"
                 data-active={editor.isActive('link') || null}
                 onClick={showLink}
                 title={t('link', lang)}>
                <LinkIcon/>
            </div>

            {isModalOpen && (
                <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/10 tw:backdrop-blur-xs tw:z-50">
                    <div className="tw:flex tw:flex-col tw:relative tw:bg-white tw:dark:bg-gray-600 tw:gap-3 tw:p-6 tw:rounded-lg tw:shadow-lg tw:w-96">
                        <div className="tw:flex tw:flex-row tw:justify-between tw:items-center tw:mb-1">
                            <span className="tw:font-bold">{t('addLink', lang)}</span>
                            <div onClick={() => {
                                setIsModalOpen(false);
                            }} className="tw:cursor-pointer tw:text-gray-700 tw:hover:text-gray-500"
                                 aria-label={t('close', lang)}>
                                <XIcon/>
                            </div>
                        </div>
                        <div className="tw:flex tw:flex-col tw:gap-2">
                            <input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                type="text"
                                className="tw:p-1.5 tw:text-gray-800 tw:dark:text-gray-300 tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:px-1"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="tw:flex tw:justify-center tw:w-full tw:p-2 tw:bg-gray-300 tw:dark:bg-gray-500 tw:rounded tw:hover:bg-gray-400 tw:cursor-pointer"
                             onClick={addLink}>
                            {editor.isActive('link') ? t('update', lang) : t('add', lang)}
                        </div>
                        {editor.isActive('link') && (
                            <div className="tw:flex tw:justify-center tw:w-full tw:p-2 tw:bg-red-100 tw:dark:bg-red-900 tw:rounded tw:hover:bg-red-200 tw:cursor-pointer"
                                 onClick={() => {
                                     editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                     setIsModalOpen(false);
                                 }}>
                                {t('removeLink', lang)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkButton;
