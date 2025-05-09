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
    /* ➊ تعریف اتریبیوت‌های id و class */
    addAttributes() {
        return {
            ...this.parent?.(),

            id: {
                default    : null,
                parseHTML  : el   => el.getAttribute('id'),
                renderHTML : attrs => attrs.id ? { id: attrs.id } : {},
            },

            class: {
                default    : 'anchor-target',          // همیشه این کلاس را داریم
                parseHTML  : el   => {
                    const classes = el.getAttribute('class')?.split(/\s+/) ?? []
                    return [...new Set([...classes, 'anchor-target'])].join(' ')
                },
                renderHTML : attrs => {
                    const classes = new Set((attrs.class ?? '').split(/\s+/).filter(Boolean))
                    classes.add('anchor-target')
                    return { class: Array.from(classes).join(' ') }
                },
            },
        }
    },

    /* ➋ پلاگین ProseMirror برای مدیریت آیدی‌ها */
    addProseMirrorPlugins() {
        return [
            new Plugin({
                appendTransaction: (transactions, oldState, newState) => {
                    // اگر هیچ تغییری در داکیومنت رخ نداده، کاری نکن
                    if (!transactions.some(tr => tr.docChanged)) return null

                    const { doc } = newState
                    const tr       = newState.tr
                    let needUpdate = false

                    /* جدولی برای شمارش تکرار اسلاگ‌ها */
                    const slugCount = new Map()   // key = slug, value = تعداد دیده‌شده

                    doc.descendants((node, pos) => {
                        if (node.type.name !== 'heading') return

                        const text = node.textContent.trim()   // محتوای هدینگ
                        let   { id, class: cls = '' } = node.attrs
                        let   changed = false

                        /* ① اگر متن خالی بود، آیدی را کاملاً پاک کن */
                        if (!text) {
                            if (id) {
                                tr.setNodeMarkup(pos, undefined, { ...node.attrs, id: null })
                                needUpdate = true
                            }
                            return
                        }

                        /* ② تولید اسلاگ + جلوگیری از تکرار */
                        const base   = createSlug(text) || 'untitled'
                        const seen   = slugCount.get(base) ?? 0
                        const unique = seen === 0 ? base : `${base}-${seen}`

                        slugCount.set(base, seen + 1)

                        if (id !== unique) {
                            id      = unique
                            changed = true
                        }

                        /* ③ اطمینان از وجود کلاس anchor-target */
                        if (!cls.split(/\s+/).includes('anchor-target')) {
                            cls     = `${cls} anchor-target`.trim()
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
