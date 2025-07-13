import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'audio',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    /** ویژگی‌ها (Attributes) */
    addAttributes() {
        return {
            src:       { default: null },
            controls:  { default: true },
            alt:       { default: null },
            align:     { default: 'left' },    // چپ | وسط | راست
            style:     { default: 'width:560px;height:auto;cursor:pointer;' },
        }
    },

    /** تعریف Schema */
    parseHTML() { return [{ tag: 'audio[src]' }] },

    /** خروجی HTML */
    renderHTML({ HTMLAttributes }) {
        const { align = 'left', style = '' } = HTMLAttributes

        // استایل برای ترازبندی
        const extra =
            align === 'center'
                ? 'display:block;margin-left:auto;margin-right:auto;'
                : align === 'right'
                    ? 'float:right;margin-left:auto;'
                    : 'float:left;'

        return [
            'audio',
            mergeAttributes(
                HTMLAttributes,
                {
                    controls: true,            // همیشه controls داشته باشه
                    style: style + extra,      // استایل اصلی + ترازبندی
                    align: null,               // حذف ویژگی منسوخ align
                },
            ),
        ]
    },

    /** دستورات (Commands) */
    addCommands() {
        return {
            insertAudio:
                attrs =>
                    ({ commands }) =>
                        commands.insertContent({ type: this.name, attrs }),
        }
    },

    /** نمایش در ادیتور (Node-View) */
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor
            const { style, align } = node.attrs

            /** wrapper برای ترازبندی در ادیتور */
            const wrap = document.createElement('div')
            wrap.style.cssText =
                'display:flex;width:100%;justify-content:' +
                (align === 'center'
                    ? 'center'
                    : align === 'right'
                        ? 'flex-end'
                        : 'flex-start')

            /** کانتینر اصلی */
            const box = document.createElement('div')
            box.style.cssText = `position:relative;display:inline-block;${style}`

            /** عنصر صوتی */
            const audio = document.createElement('audio')
            audio.setAttribute('controls', 'true')
            Object.entries(node.attrs).forEach(([k, v]) => v && audio.setAttribute(k, v))

            /** نوار ابزار بالای فایل صوتی */
            const bar = document.createElement('div')
            bar.style.cssText =
                'position:absolute;top:0;left:50%;transform:translate(-50%,-100%);' +
                'display:flex;gap:4px;padding:2px 4px;background:#fff;border:1px solid #888;' +
                'border-radius:4px;z-index:10;font-size:0;'

            /** تابع کمکی برای ساخت دکمه‌ها */
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

            /** تابع‌های کمکی برای ذخیره تغییرات */
            const dispatch = attrs =>
                view.dispatch(
                    view.state.tr.setNodeMarkup(getPos(), null, { ...node.attrs, ...attrs }),
                )
            const saveAlign = a => dispatch({ align: a })

            /** دکمه‌های ترازبندی */
            mkBtn(
                'چپ',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg',
                () => {
                    wrap.style.justifyContent = 'flex-start'
                    saveAlign('left')
                },
            )
            mkBtn(
                'وسط',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg',
                () => {
                    wrap.style.justifyContent = 'center'
                    saveAlign('center')
                },
            )
            mkBtn(
                'راست',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg',
                () => {
                    wrap.style.justifyContent = 'flex-end'
                    saveAlign('right')
                },
            )

            /** ویرایش alt */
            mkBtn(
                'alt',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/edit/default/20px.svg',
                () => {
                    const cur = audio.getAttribute('alt') || ''
                    const txt = prompt('متن alt را وارد کنید:', cur)
                    if (txt !== null) {
                        audio.setAttribute('alt', txt)
                        dispatch({ alt: txt })
                    }
                },
            )

            /** حذف فایل صوتی */
            mkBtn(
                'حذف',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/delete/default/20px.svg',
                () => {
                    const from = getPos()
                    view.dispatch(view.state.tr.delete(from, from + node.nodeSize))
                },
            )

            /** دستگیره جابجایی (Drag Handle) */
            const drag = document.createElement('span')
            drag.title = 'جابجایی'
            drag.setAttribute('draggable', 'true')
            drag.classList.add('ProseMirror-drag-handle')
            drag.style.cssText =
                'width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;' +
                'cursor:grab;border-radius:4px;'
            drag.innerHTML =
                '<img src="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/open_with/default/20px.svg" width="20" height="20">'
            bar.appendChild(drag)

            /** مونتاژ نهایی */
            wrap.appendChild(box)
            box.append(audio, bar)
            return { dom: wrap }
        }
    },
})
