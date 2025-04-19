// src/tiptap/nodes/ColoredBox.js
import { Node } from '@tiptap/core';

export const ColoredBox = Node.create({
    name: 'coloredBox',

    group: 'block',

    content: 'block+',

    addAttributes() {
        return {
            backgroundColor: {
                default: '#ffffff',
                parseHTML: (element) => element.getAttribute('data-bg-color'),
                renderHTML: (attributes) => ({
                    'data-bg-color': attributes.backgroundColor,
                    style: `background-color: ${attributes.backgroundColor}`,
                }),
            },
            borderRadius: {
                default: '4px',
                parseHTML: (element) => element.getAttribute('data-border-radius'),
                renderHTML: (attributes) => ({
                    'data-border-radius': attributes.borderRadius,
                    style: `border-radius: ${attributes.borderRadius}`,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div.colored-box',
                getAttrs: (element) => ({
                    backgroundColor: element.getAttribute('data-bg-color') || '#ffffff',
                    borderRadius: element.getAttribute('data-border-radius') || '4px',
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            {
                class: 'colored-box tw-p-3 tw-my-2',
                ...HTMLAttributes,
            },
            0, // محتوای داخلی
        ];
    },

    addCommands() {
        return {
            setColoredBox:
                (attributes) =>
                    ({ chain }) => {
                        return chain()
                            .setNode(this.name, attributes)
                            .run();
                    },
            unsetColoredBox:
                () =>
                    ({ chain }) => {
                        return chain().setNode('paragraph').run();
                    },
        };
    },
});
