import { Extension } from '@tiptap/core';

const IndentExtension = Extension.create({
    name: 'indent',
    addOptions() {
        return {
            lang: 'en', // زبان پیش‌فرض انگلیسی
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: ['paragraph', 'heading'],
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: element => {
                            const margin = this.options.lang === 'fa' ? element.style.marginRight : element.style.marginLeft;
                            return parseInt(margin) / 20 || 0;
                        },
                        renderHTML: attributes => {
                            if (attributes.indent > 0) {
                                const style = this.options.lang === 'fa'
                                    ? `margin-right: ${attributes.indent * 20}px`
                                    : `margin-left: ${attributes.indent * 20}px`;
                                return { style };
                            }
                            return {};
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            indent: () => ({ commands }) => {
                return commands.updateAttributes('paragraph', { indent: (this.editor.getAttributes('paragraph').indent || 0) + 1 });
            },
            outdent: () => ({ commands }) => {
                const currentIndent = this.editor.getAttributes('paragraph').indent || 0;
                if (currentIndent > 0) {
                    return commands.updateAttributes('paragraph', { indent: currentIndent - 1 });
                }
                return false;
            },
        };
    },
});

export default IndentExtension;
