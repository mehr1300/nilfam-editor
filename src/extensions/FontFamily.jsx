import {Extension} from "@tiptap/core";

export const FontFamily = Extension.create({
    name: 'fontFamily',
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
                    fontFamily: {
                        default: null,
                        parseHTML: (element) => element.style.fontFamily || null,
                        renderHTML: (attributes) => {
                            if (!attributes.fontFamily) return {};
                            return { style: `font-family: ${attributes.fontFamily};` };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontFamily: (fontFamily) => ({ chain }) => {
                return chain().setMark('textStyle', { fontFamily }).run();
            },
        };
    },
});
