// src/tiptap/extensions/ColoredBox.js   ← مسیر پیشنهادی
import { Node } from '@tiptap/core';

export const ColoredBox = Node.create({
    name: 'coloredBox',

    group: 'block',
    content: 'block+',
    isolating: true,          // انتخاب راحت‌تر و جلوگیری از ادغام ناخواسته
    defining: true,           // حفظ نود در دستورات split–join

    addAttributes() {
        return {
            backgroundColor: {
                default: '#ffffff',
                parseHTML: el => el.getAttribute('data-bg-color'),
                renderHTML: attrs => ({
                    'data-bg-color': attrs.backgroundColor,
                    style: `background-color:${attrs.backgroundColor}`
                })
            },
            borderRadius: {
                default: '4px',
                parseHTML: el => el.getAttribute('data-border-radius'),
                renderHTML: attrs => ({
                    'data-border-radius': attrs.borderRadius,
                    style: `border-radius:${attrs.borderRadius}`
                })
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div.colored-box'
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            {
                class: 'colored-box tw:p-3 tw:my-2',
                ...HTMLAttributes
            },
            0
        ];
    },

    addCommands() {
        return {
            /** چند بلاک را در یک ColoredBox می‌پیچد */
            setColoredBox:
                attrs =>
                    ({ chain, state }) => {
                        // اگر همین الان داخل coloredBox هستیم دوباره wrap نشود
                        const { $from } = state.selection;
                        if ($from.node(-1).type.name === this.name) return false;

                        return chain()
                            .wrapIn(this.name, attrs) // ← تفاوت اصلی
                            .run();
                    },

            /** خارج کردنِ بلاک‌های انتخاب‌شده از ColoredBox */
            unsetColoredBox:
                () =>
                    ({ chain }) =>
                        chain()
                            .lift(this.name) // معادل unwrap
                            .run()
        };
    }
});
