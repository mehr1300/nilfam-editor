import {t} from "../Lang/i18n.js";
import {LinkIcon, XIcon} from "../../assets/icons/Icons.jsx";
import {useEffect, useState} from "react";
import {Configs} from "../config/Configs.js";

const LinkButton = ({editor,lang}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState('');

    const showLink = () => {
        setIsModalOpen(true);
    };

    const addLink = () => {
        if (value !== "") editor.chain().focus().setLink({href: value}).run()
        setIsModalOpen(false)
    };

    useEffect(() => {
        if(isModalOpen){
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = '17px'
        }else{
            document.body.style.overflow = 'auto'
            document.body.style.paddingRight = '0px'
        }
    }, [isModalOpen])

    return (
        <div>
            <button className="class-button data-active:bg-gray-300" data-active={editor.isActive('link') || null}
                    onClick={()=>{showLink()}}
                    title={t('link', lang)}><LinkIcon/>
            </button>
            {/*<button className="class-button data-active:bg-gray-300" data-active={editor.isActive('link') || null} onClick={() => {*/}
            {/*    const url = prompt('آدرس لینک:');*/}
            {/*    if (url) editor.chain().focus().setLink({href: url}).run();*/}
            {/*}} title={t('link', lang)}><LinkIcon/>*/}
            {/*</button>*/}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs z-50">
                    <div className="flex flex-col relative bg-white gap-3 p-6 rounded-lg shadow-lg w-96">
                        <div className="flex flex-row justify-between items-center mb-1">
                            <span className="font-bold"> {t('addLink', lang)}</span>
                            <button onClick={() => {setIsModalOpen(false);}} className="cursor-pointer text-gray-700 hover:text-gray-500" aria-label={t('close', lang)}>
                                <XIcon/>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <input value={value} onChange={(e) => setValue(e.target.value)} type="text" className="p-1.5 text-gray-800 border border-gray-300 rounded px-1"/>
                        </div>
                        <button className="w-full p-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer" onClick={() => addLink()}>
                            {t('add', lang)}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LinkButton;
