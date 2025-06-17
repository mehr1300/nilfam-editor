import { useState, useEffect } from 'react';
import { t } from '../Lang/i18n.js';

const SelectFontButton = ({ editor, fonts, lang }) => {
    const [font, setFont] = useState('');

    // به‌روزرسانی فونت با تغییر انتخاب یا محتوای ادیتور
    useEffect(() => {
        if (!editor) return;

        const updateFontFamily = () => {
            const { state } = editor;
            const { from, to } = state.selection;

            // بررسی ویژگی fontFamily در متن انتخاب‌شده
            let currentFontFamily = '';
            editor.state.doc.nodesBetween(from, to, (node) => {
                if (node.marks) {
                    const fontFamilyMark = node.marks.find(
                        (mark) => mark.type.name === 'textStyle' && mark.attrs.fontFamily
                    );
                    if (fontFamilyMark) {
                        currentFontFamily = fontFamilyMark.attrs.fontFamily;
                    }
                }
            });

            // تنظیم فونت فعلی یا خالی اگر فونتی پیدا نشد
            setFont(currentFontFamily || '');
        };

        // گوش دادن به تغییرات انتخاب و به‌روزرسانی ادیتور
        editor.on('selectionUpdate', updateFontFamily);
        editor.on('update', updateFontFamily);

        // اجرای اولیه برای تنظیم مقدار اولیه
        updateFontFamily();

        // تمیز کردن listenerها هنگام unmount
        return () => {
            editor.off('selectionUpdate', updateFontFamily);
            editor.off('update', updateFontFamily);
        };
    }, [editor]);

    // تغییر فونت با انتخاب کاربر
    const handleFontChange = (e) => {
        const selectedFont = e.target.value;
        setFont(selectedFont);
        try {
            if (selectedFont) {
                // اعمال فونت جدید
                const success = editor.chain().focus().setFontFamily(selectedFont).run();
                if (!success) {
                    console.warn('Failed to set font family:', selectedFont);
                }
            } else {
                // حذف فونت (بازگشت به پیش‌فرض)
                const success = editor.chain().focus().unsetFontFamily().run();
                if (!success) {
                    console.warn('Failed to unset font family');
                }
            }
        } catch (error) {
            console.error('Error changing font family:', error);
        }
    };

    return (
        <div>
            <select
                className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm"
                value={font}
                onChange={handleFontChange}
            >
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="">
                    {t('defaultFont', lang)}
                </option>
                {fonts.map((item) => (
                    <option
                        className="tw:dark:bg-gray-700 tw:dark:text-gray-300"
                        key={item.value}
                        value={item.value}
                    >
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFontButton;
