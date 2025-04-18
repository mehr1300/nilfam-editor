import { Extension } from '@tiptap/core'

export const EnterSmartBreak = Extension.create({
    name: 'enterSmartBreak',

    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { state } = editor
                const { $from } = state.selection
                const tr = state.tr
                if (
                    $from.parent.type.name !== 'paragraph' ||
                    $from.parent.content.size !== 0
                ) {
                    return false
                }
                const brType =
                    state.schema.nodes.hardBreak || state.schema.nodes.hard_break
                if (!brType) return false       // در صورت نبود، کاری نکن

                const pos = $from.pos          // داخل پاراگراف تهی

                tr.insert(pos, brType.create()) // 1) درج <br>
                tr.split(pos + 1)               // 2) پاراگراف تازه زیر آن

                editor.view.dispatch(tr)
                return true     // اجرای پیش‌فرض را خنثی کردیم
            },
        }
    },
})
