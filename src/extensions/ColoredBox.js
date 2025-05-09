import { Node, mergeAttributes } from '@tiptap/core'

export const ColoredBox = Node.create({
    name: 'coloredBox',
    group: 'block',
    content: 'block+',
    defining: true,     // اجازه می‌دهد داخلش انتخاب انجام شود
    draggable: false,

    /* خصوصیات دیداری */
    addAttributes() {
        return {
            backgroundColor: {
                default   : '#ffffff',
                parseHTML : el => el.style.backgroundColor || '#ffffff',
                renderHTML: attrs => ({
                    style: `padding:${attrs.paddingBox};background-color:${attrs.backgroundColor};border-radius:${attrs.borderRadius}`,
                }),
            },
            borderRadius: {
                default   : '4px',
                parseHTML : el => el.style.borderRadius || '4px',
                renderHTML: () => ({}),             // در style بالا می‌آید
            },
            paddingBox: {
                default   : '8px',
                parseHTML : el => el.style.paddingBox || '8px',
                renderHTML: () => ({}),             // در style بالا می‌آید
            },
        }
    },

    /* HTML → داک ، داک → HTML */
    parseHTML()     { return [{ tag: 'div[data-colored-box]' }] },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes({ 'data-colored-box': '' }, HTMLAttributes), 0]
    },

    /* کامندها */
    addCommands() {
        return {
            /** اگر داخل باکس باشیم فقط attribute را به‌روزرسانی می‌کند؛
             *  وگرنه باکس تازه‌ای دور بازه‌ی انتخاب می‌کشد. */
            setColoredBox:
                attrs => ({ editor, commands }) => {
                    return editor.isActive('coloredBox')
                        ? commands.updateAttributes('coloredBox', attrs)
                        : commands.wrapIn(this.name, attrs)
                },

            /** باکس را برمی‌دارد و محتوایش را آزاد می‌کند */
            unsetColoredBox:
                () => ({ commands }) => commands.lift(this.name),
        }
    },
})
