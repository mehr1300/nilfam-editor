import {useState} from 'react';
import {t} from "../Lang/i18n.js";

const SelectFontButton = ({editor,fonts,lang}) => {
    const [font, setFont] = useState('');

    return (
        <div>
            <select value={font} className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm" onChange={(e) => {
                const selectedFont = e.target.value;
                setFont(selectedFont);
                editor.chain().focus().setFontFamily(selectedFont).run(); // تغییر فونت با setFontFamily
            }}>
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="">{ t('defaultFont', lang) }</option>
                {fonts.map((item) => (
                    <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" key={item.value} value={item.value}>{item.label}</option>
                ))}
                {/*<option value="IRANSansXFaNum">فونت ایران سنس</option>*/}
                {/*<option value="Kalameh">فونت کلمه</option>*/}
                {/*<option value="Pelak">فونت پلاک</option>*/}
                {/*<option value="IRANYekanFaNum">فونت یکان</option>*/}
                {/*<option value="FontQurani">فونت قرآنی</option>*/}
            </select>
        </div>
    );
};

export default SelectFontButton;
