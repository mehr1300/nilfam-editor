import { Plugin } from 'prosemirror-state'
import { Heading } from '@tiptap/extension-heading'

function createSlug(text) {
    return text
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[؟?.,،؛:]/g, '')
        .toLowerCase()
}

export const HeadingWithAutoId = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),

            /* id خودکار */
            id: {
                default: null,
                parseHTML: el => el.getAttribute('id'),
                renderHTML: attrs => attrs.id ? { id: attrs.id } : {},
            },

            /* کلاس ثابت anchor‑target */
            class: {
                default: 'anchor-target',
                parseHTML: el => {
                    // اگر کلاس‌های دیگری هم وجود داشت آن‌ها را نگه می‌داریم
                    const classes = el.getAttribute('class')?.split(/\s+/) ?? []
                    return [...new Set([...classes, 'anchor-target'])].join(' ')
                },
                renderHTML: attrs => {
                    // اطمینان از حضور anchor-target در خروجی
                    const classes = new Set((attrs.class ?? '').split(/\s+/).filter(Boolean))
                    classes.add('anchor-target')
                    return { class: Array.from(classes).join(' ') }
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                appendTransaction: (transactions, oldState, newState) => {
                    if (!transactions.some(tr => tr.docChanged)) return null

                    const { doc } = newState
                    const tr = newState.tr
                    let needUpdate = false

                    doc.descendants((node, pos) => {
                        if (node.type.name !== 'heading') return

                        let { id, class: cls = '' } = node.attrs
                        let changed = false

                        // ① افزودن id اگر نبود
                        if (!id) {
                            id = createSlug(node.textContent) || 'untitled'
                            changed = true
                        }

                        // ② افزودن کلاس anchor‑target اگر نبود
                        if (!cls.split(/\s+/).includes('anchor-target')) {
                            cls = `${cls} anchor-target`.trim()
                            changed = true
                        }

                        if (changed) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, id, class: cls })
                            needUpdate = true
                        }
                    })

                    return needUpdate ? tr : null
                },
            }),
        ]
    },
})
