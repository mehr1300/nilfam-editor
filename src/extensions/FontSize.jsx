import {Extension} from "@tiptap/core";

export const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize || null,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                    textColor: {
                        default: null,
                        parseHTML: (element) => element.style.color || null,
                        renderHTML: (attributes) => {
                            if (!attributes.textColor) return {};
                            return { style: `color: ${attributes.textColor}` };
                        },
                    },
                    borderColor: {
                        default: null,
                        parseHTML: (element) => element.style.border || null,
                        renderHTML: (attributes) => {
                            if (!attributes.borderColor) return {};
                            return { style: `border: 1px solid ${attributes.borderColor}` };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: (fontSize) => ({ chain }) => {
                return chain().setMark('textStyle', { fontSize }).run();
            },
            setTextColor: (textColor) => ({ chain }) => {
                return chain().setMark('textStyle', { textColor }).run();
            },
            setBorderColor: (borderColor) => ({ chain }) => {
                return chain().setMark('textStyle', { borderColor }).run();
            },
            unsetTextStyle: () => ({ chain }) => {
                return chain().unsetMark('textStyle').run();
            },
        };
    },
});
