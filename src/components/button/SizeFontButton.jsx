import {t} from "../Lang/i18n.js";

const SizeFontButton = ({editor,lang}) => {
    return (
        <div>
            <select className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm" onChange={(e) => {
                const level = parseInt(e.target.value);
                if (level) editor.chain().focus().setFontSize(level).run();
            }}>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="">{ t('fontSize', lang) }</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="8">8</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="3">10</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="12">12</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="14">14</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="16">16</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="18">18</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="20">20</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="22">22</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="24">24</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="26">26</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="28">28</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="36">36</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="46">46</option>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="56">56</option>
            </select>
        </div>
    );
};

export default SizeFontButton;
