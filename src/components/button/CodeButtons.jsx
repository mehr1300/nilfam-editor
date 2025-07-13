import { useState } from 'react';
import { t } from '../Lang/i18n.js';
import {CodeIcon, CodeOffIcon} from "../../assets/icons/Icons.jsx";

const CodeButtons = ({ editor, lang }) => {
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    const addCode = () => {
        setIsLanguageModalOpen(true);
    };

    const applyCodeBlock = (language) => {
        if (editor.isActive('codeBlock')) {
            editor
                .chain()
                .focus()
                .updateAttributes('codeBlock', { language })
                .run()
        } else {
            editor
                .chain()
                .focus()
                .setCodeBlock({ language })
                .run()
        }

        setIsLanguageModalOpen(false);
    };

    // const unsetCodeBlock = () => {
    //     if (editor.isActive('codeBlock')) {
    //         editor.chain().focus().unsetCodeBlock().run();
    //     }
    // };
    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'css', label: 'CSS' },
        { value: 'html', label: 'HTML' },
        { value: 'php', label: 'PHP' },
        { value: 'rust', label: 'Rust' },
        { value: 'go', label: 'Go' },
    ];

    return (
        <>
            <div className="class-button" onClick={addCode} title={t('code', lang)}>
                <CodeIcon/>
            </div>
            {/*<div*/}
            {/*    className="class-button"*/}
            {/*    onClick={unsetCodeBlock}*/}
            {/*    title={t('unsetCode', lang)}*/}
            {/*    disabled={!editor?.isActive('codeBlock')} // غیرفعال اگه روی کد نباشیم*/}
            {/*>*/}
            {/*    <CodeOffIcon/>*/}
            {/*</div>*/}

            {/* مدال انتخاب زبان */}
            {isLanguageModalOpen && (
                <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/10 tw:backdrop-blur-xs tw:z-50">
                    <div className="tw:bg-white tw:dark:bg-gray-600 tw:p-6 tw:rounded-lg tw:shadow-lg tw:w-80">
                        <h3 className="tw:text-lg tw:font-semibold tw:mb-4">{t('selectCodeLanguage', lang)}</h3>
                        <div className="tw:flex tw:flex-col tw:gap-2">
                            {languages.map((langItem) => (
                                <div
                                    key={langItem.value}
                                    className="tw:p-2 tw:cursor-pointer tw:dark:text-gray-300 tw:text-left tw:rounded tw:hover:bg-gray-100 tw:dark:bg-gray-500 tw:dark:hover:bg-gray-700"
                                    onClick={() => applyCodeBlock(langItem.value)}
                                >
                                    {langItem.label}
                                </div>
                            ))}
                        </div>
                        <div
                            className="tw:flex tw:justify-center tw:mt-4 tw:w-full tw:p-2 tw:bg-gray-300 tw:dark:bg-gray-500 tw:rounded tw:hover:bg-gray-400"
                            onClick={() => setIsLanguageModalOpen(false)}>
                            {t('close', lang)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CodeButtons;
