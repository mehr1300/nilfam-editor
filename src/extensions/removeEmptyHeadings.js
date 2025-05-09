// extensions/removeEmptyHeadings.js
import { Plugin } from 'prosemirror-state'

export const RemoveEmptyHeadings = () =>
    new Plugin({
        appendTransaction(trans, oldState, newState) {
            if (!trans.some(tr => tr.docChanged)) return null

            const { tr } = newState
            let modified = false

            newState.doc.descendants((node, pos) => {
                if (node.type.name === 'heading' && node.textContent.trim() === '') {
                    // به پاراگرافِ خالی تبدیل کن
                    tr.setNodeMarkup(pos, newState.schema.nodes.paragraph, {})
                    modified = true
                }
            })

            return modified ? tr : null
        },
    })
