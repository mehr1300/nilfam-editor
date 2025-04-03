import {mergeAttributes, Node} from "@tiptap/core";

export const Audio = Node.create({
    name: 'audio',
    group: 'block',
    selectable: true,
    atom: true,
    addAttributes() {
        return {
            src: {},
            controls: { default: true },
            style: { default: 'max-width:100%;' },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'audio',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['audio', mergeAttributes(HTMLAttributes, { controls: true }), 0];
    },
    addCommands() {
        return {
            insertAudio: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
});
