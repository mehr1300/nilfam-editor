import {t} from "../Lang/i18n.js";


const LineHeightButton = ({editor,lang}) => {
    return (
        <div>
            <select className="tw:border tw:dark:text-gray-300 tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm" onChange={(e) => {
                const value = e.target.value;
                editor.chain().focus().setLineHeight(value).run();
            }} value={editor.getAttributes('paragraph').lineHeight || '1.5'}>
                <option value="1">{ t('lineHeight', lang) } : 1</option>
                <option value="1.15">{ t('lineHeight', lang) } : 1.15</option>
                <option value="1.5">{ t('lineHeight', lang) } : 1.5</option>
                <option value="1.8">{ t('lineHeight', lang) } : 1.8</option>
                <option value="2">{ t('lineHeight', lang) } : 2</option>
                <option value="2.5">{ t('lineHeight', lang) } : 2.5</option>
                <option value="3">{ t('lineHeight', lang) } : 3</option>
            </select>
        </div>
    );
};

export default LineHeightButton;
