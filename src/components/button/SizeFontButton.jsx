import {t} from "../Lang/i18n.js";

const SizeFontButton = ({editor,lang}) => {
    return (
        <div>
            <select className="tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm" onChange={(e) => {
                const level = parseInt(e.target.value);
                if (level) editor.chain().focus().setFontSize(level).run();
            }}>
                <option value="">{ t('fontSize', lang) }</option>
                <option value="8">8</option>
                <option value="3">10</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="22">22</option>
                <option value="24">24</option>
                <option value="26">26</option>
                <option value="28">28</option>
                <option value="36">36</option>
                <option value="46">46</option>
                <option value="56">56</option>
            </select>
        </div>
    );
};

export default SizeFontButton;
