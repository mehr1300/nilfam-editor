import { Node } from '@tiptap/core';

const CustomBlockquote = Node.create({
    name: 'blockquote',
    group: 'block',
    content: 'block+',
    parseHTML() {
        return [{ tag: 'blockquote' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['blockquote', HTMLAttributes, 0];
    },
    addCommands() {
        return {
            toggleBlockquote: () => ({ commands }) => {
                return commands.toggleWrap('blockquote');
            },
        };
    },
});

export default CustomBlockquote;
