import {mergeAttributes, Node} from "@tiptap/core";

export const Video = Node.create({
    name: 'video',
    group: 'block',
    selectable: true,
    atom: true,
    addAttributes() {
        return {
            src: {},
            controls: { default: true },
            alt: { default: null },
            style: { default: 'max-width:100%;' },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'video',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes, { controls: true }), 0];
    },
    addCommands() {
        return {
            insertVideo: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
});
