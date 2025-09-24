import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'audio',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    /* ───────── Attributes ───────── */
    addAttributes() {
        return {
            src: { default: null },       // لینک فایل صوتی
            controls: { default: true },  // همیشه true
            alt: { default: null },
            align: { default: 'left' },   // left | center | right
            width: { default: 560 },
        }
    },

    /* ───────── Schema ───────── */
    parseHTML() {
        return [
            {
                tag: 'div.audio-wrapper audio[src]',
                getAttrs: (dom) => ({
                    src: dom.getAttribute('src'),
                    alt: dom.getAttribute('alt'),
                    controls: dom.hasAttribute('controls'),
                    align: dom.getAttribute('data-align') || 'left',
                    width: parseInt(dom.getAttribute('data-width')) || 560,
                }),
            },
            {
                // fallback اگر فقط audio ذخیره شده بود
                tag: 'audio[src]',
                getAttrs: (dom) => ({
                    src: dom.getAttribute('src'),
                    alt: dom.getAttribute('alt'),
                    controls: dom.hasAttribute('controls'),
                    align: dom.getAttribute('data-align') || 'left',
                    width: parseInt(dom.getAttribute('data-width')) || 560,
                }),
            },
        ]
    },

    /* ───────── renderHTML (خروجی نهایی) ───────── */
    renderHTML({ HTMLAttributes }) {
        const { align = 'left', width = 560 } = HTMLAttributes
        const wrapStyle =
            `display:block;max-width:${width}px;width:100%;` +
            (align === 'center'
                ? 'margin-inline:auto;'
                : align === 'right'
                    ? 'margin-left:auto;'
                    : 'margin-right:auto;')

        return [
            'div',
            { class: 'audio-wrapper', style: wrapStyle },
            [
                'audio',
                mergeAttributes(HTMLAttributes, {
                    controls: true,
                    style: 'width:100%;', // فقط عرض
                    align: null,
                    'data-align': align,
                    'data-width': width,
                }),
            ],
        ]
    },

    /* ───────── Commands ───────── */
    addCommands() {
        return {
            insertAudio:
                attrs =>
                    ({ commands }) =>
                        commands.insertContent({ type: this.name, attrs }),
        }
    },

    /* ───────── NodeView (نمایش در ادیتور) ───────── */
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor
            const { align, width } = node.attrs

            // ظرف اصلی
            const wrap = document.createElement('div')
            wrap.style.cssText =
                'display:flex;width:100%;justify-content:' +
                (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start')

            const box = document.createElement('div')
            box.style.cssText = `position:relative;width:${width}px;max-width:100%;`

            // پلیر صوتی
            const audio = document.createElement('audio')
            audio.setAttribute('controls', 'true')
            Object.entries(node.attrs).forEach(([k, v]) => {
                if (v == null) return
                if (['align', 'width'].includes(k)) return
                audio.setAttribute(k, v)
            })
            audio.style.cssText = 'width:100%;'

            // نوار ابزار
            const bar = document.createElement('div')
            bar.style.cssText =
                'position:absolute;top:0;left:50%;transform:translate(-50%,-100%);' +
                'display:flex;gap:4px;padding:2px 4px;background:#fff;border:1px solid #888;' +
                'border-radius:4px;z-index:10;font-size:0;'

            const mkBtn = (title, svg, fn) => {
                const btn = document.createElement('span')
                btn.title = title
                btn.style.cssText =
                    'width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;' +
                    'cursor:pointer;border-radius:4px;'
                btn.innerHTML = `<img src="${svg}" width="20" height="20">`
                btn.onclick = fn
                bar.appendChild(btn)
            }

            const dispatch = attrs =>
                view.dispatch(
                    view.state.tr.setNodeMarkup(getPos(), null, { ...node.attrs, ...attrs }),
                )

            const saveAlign = a => {
                wrap.style.justifyContent = a === 'center' ? 'center' : a === 'right' ? 'flex-end' : 'flex-start'
                dispatch({ align: a })
            }

            // دکمه‌های ترازبندی
            mkBtn('چپ', 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg', () => saveAlign('left'))
            mkBtn('وسط', 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg', () => saveAlign('center'))
            mkBtn('راست', 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg', () => saveAlign('right'))

            // دکمه alt
            mkBtn('alt', 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/edit/default/20px.svg', () => {
                const cur = audio.getAttribute('alt') || ''
                const txt = prompt('متن alt را وارد کنید:', cur)
                if (txt !== null) {
                    audio.setAttribute('alt', txt)
                    dispatch({ alt: txt })
                }
            })

            // دکمه حذف
            mkBtn('حذف', 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/delete/default/20px.svg', () => {
                const from = getPos()
                view.dispatch(view.state.tr.delete(from, from + node.nodeSize))
            })

            // drag handle
            const drag = document.createElement('span')
            drag.title = 'جابجایی'
            drag.classList.add('ProseMirror-drag-handle')
            drag.setAttribute('draggable', 'true')
            drag.style.cssText =
                'width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;cursor:grab;border-radius:4px;'
            drag.innerHTML =
                '<img src="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/open_with/default/20px.svg" width="20" height="20">'
            bar.appendChild(drag)

            wrap.appendChild(box)
            box.append(audio, bar)

            return { dom: wrap }
        }
    },
})
