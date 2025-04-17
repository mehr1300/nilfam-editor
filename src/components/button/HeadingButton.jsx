// HeadingButtons.jsx
import {t} from "../Lang/i18n.js";

function HeadingButtons({ editor,lang}) {
    if (!editor) return null

    let currentLevel = null
    for (let lvl = 1; lvl <= 6; lvl++) {
        if (editor.isActive('heading', { level: lvl })) {
            currentLevel = lvl
            break
        }
    }

    const handleChange = (event) => {
        const level = parseInt(event.target.value, 10)
        if (!level) {
            editor.chain().focus().setParagraph().run()
        } else {
            editor.chain().focus().toggleHeading({ level }).run()
        }
    }

    return (
        <div>
            <select className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm tw:w-28" value={currentLevel || ''} onChange={handleChange}>
                <option value="">{t('heading', lang)}</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option value="5">H5</option>
                <option value="6">H6</option>
            </select>
        </div>
    )

}

export default HeadingButtons
