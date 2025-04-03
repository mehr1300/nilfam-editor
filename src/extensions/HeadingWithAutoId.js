import { Plugin } from 'prosemirror-state'
import { Heading } from '@tiptap/extension-heading'

function createSlug(text) {
    return text
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[؟?.,،؛:؛]/g, '')
        .toLowerCase()
}

export const HeadingWithAutoId = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            id: {
                default: null,
                parseHTML: element => element.getAttribute('id') || null,
                renderHTML: attributes => {
                    if (!attributes.id) return {}
                    return { id: attributes.id }
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                // اگر رویدادهای dom نیاز داشتید می‌توانید در props قرار دهید
                props: {
                    handleDOMEvents: {
                        // مثال: click: (view, event) => {}
                    },
                },

                // مهم‌ترین بخش: appendTransaction
                appendTransaction: (transactions, oldState, newState) => {
                    // اگر هیچ تغییری در داکیومنت نبوده، نیازی به ادامه نیست
                    if (!transactions.some(tr => tr.docChanged)) {
                        return null
                    }

                    const { doc } = newState
                    const tr = newState.tr
                    let needUpdate = false

                    doc.descendants((node, pos) => {
                        if (node.type.name === 'heading') {
                            // اگر هدینگ ما هنوز id ندارد
                            if (!node.attrs.id) {
                                const slug = createSlug(node.textContent) || 'untitled'
                                tr.setNodeMarkup(pos, undefined, {
                                    ...node.attrs,
                                    id: slug,
                                })
                                needUpdate = true
                            }
                        }
                    })

                    if (needUpdate) {
                        return tr
                    }
                    return null
                },
            }),
        ]
    },
})
