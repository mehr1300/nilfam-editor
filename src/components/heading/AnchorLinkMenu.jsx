// components/menu/AnchorLinkMenu.jsx
import React from 'react'
import {t} from "../Lang/i18n.js";
import {ReloadIcon} from "../../assets/icons/Icons.jsx";

function AnchorLinkMenu({editor, headingsList,getHeadings, lang}) {
    if (!editor) return null

    const handleSelectChange = (e) => {
        const headingId = e.target.value
        if (!headingId) return

        const {empty} = editor.state.selection

        if (!empty) {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({href: `#${headingId}`, class: 'custom-anchor tw:text-blue-600 tw:cursor-pointer tw:hover:text-blue-800'})
                // .updateAttributes('link', { target: null, rel: null })
                .run()
        } else {
            editor
                .chain()
                .focus()
                .insertContent('لینک به هدینگ')
                .extendMarkRange('link')
                .setLink({href: `#${headingId}`, class: 'custom-anchor tw:text-blue-600 tw:cursor-pointer tw:hover:text-blue-800'})
                // .updateAttributes('link', { target: null, rel: null })
                .run()
        }
        e.target.value = ''
    }

    if (headingsList.length === 0) {
        return (
            <span className="tw:flex tw:flex-row tw:gap-2 tw:justify-between tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm tw:w-52">
                <span> {t('noHeading', lang)}</span>
                <div onClick={()=>{getHeadings()}} className="tw:hover:text-gray-300 tw:dark:hover:text-gray-400 tw:cursor-pointer"><ReloadIcon/></div>
            </span>
        )
    }

    return (
        <select className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm tw:w-52" onChange={handleSelectChange} defaultValue="">
            <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="">{t('linkToHeading', lang)}</option>
            {headingsList.map(h => (
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" key={h.id} value={h.id}>
                    {`h${h.level} - ${h.text.slice(0, 40)}`}
                </option>
            ))}
        </select>
    )
}

export default AnchorLinkMenu
