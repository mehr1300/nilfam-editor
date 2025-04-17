// components/menu/AnchorLinkMenu.jsx
import React from 'react'
import {t} from "../Lang/i18n.js";

function AnchorLinkMenu({ editor, headingsList, lang }) {
    if (!editor) return null

    const handleSelectChange = (e) => {
        const headingId = e.target.value
        if (!headingId) return

        const { empty } = editor.state.selection

        if (!empty) {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: `#${headingId}` })
                .run()
        } else {
             editor
                .chain()
                .focus()
                .insertContent('لینک به هدینگ')
                .extendMarkRange('link')
                .setLink({ href: `#${headingId}` })
                .run()
        }
        e.target.value = ''
    }

    if (headingsList.length === 0) {
        return <span className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1.5 tw:text-sm tw:w-52">
           {t('noHeading', lang)}
        </span>
    }

    return (
        <select className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm tw:w-52"
                onChange={handleSelectChange} defaultValue="">
            <option value="">{t('linkToHeading', lang)}</option>
            {headingsList.map(h => (
                <option key={h.id} value={h.id}>
                    {`h${h.level} - ${h.text.slice(0, 40)}`}
                </option>
            ))}
        </select>
    )
}

export default AnchorLinkMenu
