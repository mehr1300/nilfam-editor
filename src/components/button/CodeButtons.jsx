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
        { value: 'php', label: 'PHP' },
        { value: 'rust', label: 'Rust' },
        { value: 'go', label: 'Go' },
    ];

    return (
        <>
            <button className="class-button" onClick={addCode} title={t('code', lang)}>
                <CodeIcon/>
            </button>
            {/*<button*/}
            {/*    className="class-button"*/}
            {/*    onClick={unsetCodeBlock}*/}
            {/*    title={t('unsetCode', lang)}*/}
            {/*    disabled={!editor?.isActive('codeBlock')} // غیرفعال اگه روی کد نباشیم*/}
            {/*>*/}
            {/*    <CodeOffIcon/>*/}
            {/*</button>*/}

            {/* مدال انتخاب زبان */}
            {isLanguageModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">{t('selectCodeLanguage', lang)}</h3>
                        <div className="flex flex-col gap-2">
                            {languages.map((langItem) => (
                                <button
                                    key={langItem.value}
                                    className="p-2 text-left rounded hover:bg-gray-100"
                                    onClick={() => applyCodeBlock(langItem.value)}
                                >
                                    {langItem.label}
                                </button>
                            ))}
                        </div>
                        <button
                            className="mt-4 w-full p-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => setIsLanguageModalOpen(false)}>
                            {t('close', lang)}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CodeButtons;
