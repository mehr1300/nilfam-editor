import {Extension} from "@tiptap/core";

export const LineHeightExtension = Extension.create({
    name: 'lineHeight',

    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            defaultLineHeight: '1.8',
            lineHeights: ['1', '1.15', '1.5','1.8', '2', '2.5', '3'],
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: this.options.defaultLineHeight,
                        parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
                        renderHTML: attributes => {
                            if (!attributes.lineHeight) {
                                return {}
                            }

                            return {
                                style: `line-height: ${attributes.lineHeight}`,
                            }
                        },
                    },
                },
            },
        ]
    },

    addCommands() {
        return {
            setLineHeight: (lineHeight) => ({ commands }) => {
                return this.options.types.every(type =>
                    commands.updateAttributes(type, { lineHeight })
                )
            },
        }
    },
})
