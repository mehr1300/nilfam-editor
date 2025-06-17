import { useState, useEffect } from 'react';
import { t } from '../Lang/i18n.js';

const SizeFontButton = ({ editor, lang }) => {
    const [fontSize, setFontSize] = useState('');

    // به‌روزرسانی سایز فونت با تغییر انتخاب یا محتوای ادیتور
    useEffect(() => {
        if (!editor) return;

        const updateFontSize = () => {
            const { state } = editor;
            const { from, to } = state.selection;

            // بررسی ویژگی fontSize در متن انتخاب‌شده
            let currentFontSize = '';
            editor.state.doc.nodesBetween(from, to, (node) => {
                if (node.marks) {
                    const fontSizeMark = node.marks.find(
                        (mark) => mark.type.name === 'textStyle' && mark.attrs.fontSize
                    );
                    if (fontSizeMark) {
                        currentFontSize = fontSizeMark.attrs.fontSize.replace('px', '');
                    }
                }
            });

            setFontSize(currentFontSize || '');
        };

        // گوش دادن به تغییرات انتخاب و به‌روزرسانی ادیتور
        editor.on('selectionUpdate', updateFontSize);
        editor.on('update', updateFontSize);

        // اجرای اولیه برای تنظیم مقدار اولیه
        updateFontSize();

        // تمیز کردن listenerها هنگام unmount
        return () => {
            editor.off('selectionUpdate', updateFontSize);
            editor.off('update', updateFontSize);
        };
    }, [editor]);

    // تغییر سایز فونت با انتخاب کاربر
    const handleFontSizeChange = (e) => {
        const size = e.target.value;
        setFontSize(size);

        try {
            if (size) {
                // اعمال سایز فونت جدید
                const success = editor
                    .chain()
                    .focus()
                    .setFontSize(`${size}px`)
                    .run();
                if (!success) {
                    console.warn('Failed to set font size:', size);
                }
            } else {
                // حذف سایز فونت
                const success = editor
                    .chain()
                    .focus()
                    .unsetFontSize()
                    .run();
                if (!success) {
                    console.warn('Failed to unset font size');
                }
            }
        } catch (error) {
            console.error('Error changing font size:', error);
        }
    };

    return (
        <div>
            <select
                className="tw:border tw:dark:text-gray-300 tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:p-1 tw:text-sm"
                value={fontSize}
                onChange={handleFontSizeChange}
            >
                <option className="tw:dark:bg-gray-700 tw:dark:text-gray-300" value="">
                    {t('fontSize', lang)}
                </option>
                {['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '46', '56'].map((size) => (
                    <option
                        key={size}
                        className="tw:dark:bg-gray-700 tw:dark:text-gray-300"
                        value={size}
                    >
                        {size}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SizeFontButton;
