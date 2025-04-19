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

    // const addLink = () => {
    //     if (value !== "") editor.chain().focus().setLink({href: value}).run()
    //     setIsModalOpen(false)
    // };

    const addLink = () => {
        if (!value) {
            setIsModalOpen(false)
            return
        }
        const attrs = { href: value }
        if (!value.startsWith('#') && !value.startsWith('/')) {
            attrs.target = '_blank'
            attrs.rel    = 'noopener noreferrer nofollow'
        }
        editor.chain().focus().extendMarkRange('link').setLink(attrs).run()
        setIsModalOpen(false)
    }

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
            <div className="class-button tw:data-active:bg-gray-300 tw:dark:data-active:bg-gray-700" data-active={editor.isActive('link') || null}
                    onClick={()=>{showLink()}}
                    title={t('link', lang)}><LinkIcon/>
            </div>
            {/*<button className="class-button data-active:bg-gray-300" data-active={editor.isActive('link') || null} onClick={() => {*/}
            {/*    const url = prompt('آدرس لینک:');*/}
            {/*    if (url) editor.chain().focus().setLink({href: url}).run();*/}
            {/*}} title={t('link', lang)}><LinkIcon/>*/}
            {/*</button>*/}

            {isModalOpen && (
                <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/10 tw:backdrop-blur-xs tw:z-50">
                    <div className="tw:flex tw:flex-col tw:relative tw:bg-white tw:dark:bg-gray-600  tw:gap-3 tw:p-6 tw:rounded-lg tw:shadow-lg tw:w-96">
                        <div className="tw:flex tw:flex-row tw:justify-between tw:items-center tw:mb-1">
                            <span className="tw:font-bold"> {t('addLink', lang)}</span>
                            <div onClick={() => {setIsModalOpen(false);}} className="tw:cursor-pointer tw:text-gray-700 tw:hover:text-gray-500" aria-label={t('close', lang)}>
                                <XIcon/>
                            </div>
                        </div>
                        <div className="tw:flex tw:flex-col tw:gap-2">
                            <input value={value} onChange={(e) => setValue(e.target.value)} type="text" className="tw:p-1.5 tw:text-gray-800 tw:dark:text-gray-300 tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:px-1"/>
                        </div>
                        <div className="tw:w-full tw:p-2 tw:bg-gray-300 tw:dark:bg-gray-500 tw:rounded tw:hover:bg-gray-400 tw:cursor-pointer" onClick={() => addLink()}>
                            {t('add', lang)}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LinkButton;
