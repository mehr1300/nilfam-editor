// extensions/ResizeIframeExtension.jsx
import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    /* ─────────────── Attributes ─────────────── */
    addAttributes() {
        return {
            src:   { default: null },
            alt:   { default: null },
            align: { default: 'left' },    // left | center | right
            style: {
                default: 'width:560px;height:315px;cursor:pointer;',
            },
        }
    },

    /* ─────────────── Schema ─────────────── */
    parseHTML() {
        return [{ tag: 'iframe[src]' }]
    },

    /*
     * این بخش تعیین می‌کند چه HTML در دیتابیس ذخیره شود.
     * خصوصیت align منسوخ است؛ پس استایل مناسب را اضافه می‌کنیم.
     */
    renderHTML({ HTMLAttributes }) {
        const { align = 'left', style = '' } = HTMLAttributes

        // استایلی که وسط/راست/چپ را پیاده می‌کند
        const extra =
            align === 'center'
                ? 'display:block;margin-left:auto;margin-right:auto;'
                : align === 'right'
                    ? 'float:right;margin-left:auto;'
                    : 'float:left;'

        return [
            'iframe',
            mergeAttributes(
                HTMLAttributes,
                {
                    style: style + extra, // استایل قبلی + استایل ترازبندی
                    align: null,          // حذف attr منسوخ
                    //  اگر CSS جداگانه می‌خواهید به‌جای دو خط بالا:
                    // class: `tiptap-iframe tiptap-iframe--${align}`,
                },
            ),
        ]
    },

    /* ─────────────── Commands ─────────────── */
    addCommands() {
        return {
            insertIframe:
                attrs =>
                    ({ commands }) =>
                        commands.insertContent({ type: this.name, attrs }),
        }
    },

    /* ─────────────── Node-View (برای ادیتور) ─────────────── */
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor
            const { style, align } = node.attrs

            /* ➊ wrapper برای نمایش زندهٔ چپ/وسط/راست در ادیتور */
            const wrap = document.createElement('div')
            wrap.style.cssText =
                'display:flex;width:100%;justify-content:' +
                (align === 'center'
                    ? 'center'
                    : align === 'right'
                        ? 'flex-end'
                        : 'flex-start')

            /* ➋ Container آیفریم */
            const box = document.createElement('div')
            box.style.cssText = `position:relative;display:inline-block;${style}`

            /* عنصر IFRAME */
            const iframe = document.createElement('iframe')
            Object.entries(node.attrs).forEach(([k, v]) => v && iframe.setAttribute(k, v))

            /* ➌ نوار ابزار کوچک بالاى ویدئو */
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

            /* dispatch کمکی */
            const dispatch = attrs =>
                view.dispatch(
                    view.state.tr.setNodeMarkup(getPos(), null, { ...node.attrs, ...attrs }),
                )
            const saveSize  = ex => dispatch({ style: box.style.cssText, ...ex })
            const saveAlign = a  => dispatch({ align: a })

            /* ───────────── Buttons ───────────── */

            // چپ
            mkBtn(
                'چپ',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg',
                () => {
                    wrap.style.justifyContent = 'flex-start'
                    saveAlign('left')
                },
            )

            // وسط
            mkBtn(
                'وسط',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg',
                () => {
                    wrap.style.justifyContent = 'center'
                    saveAlign('center')
                },
            )

            // راست
            mkBtn(
                'راست',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg',
                () => {
                    wrap.style.justifyContent = 'flex-end'
                    saveAlign('right')
                },
            )

            // ALT
            mkBtn(
                'alt',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/edit/default/20px.svg',
                () => {
                    const cur = iframe.getAttribute('alt') || ''
                    const txt = prompt('متن alt را وارد کنید:', cur)
                    if (txt !== null) {
                        iframe.setAttribute('alt', txt)
                        saveSize({ alt: txt })
                    }
                },
            )

            // حذف
            mkBtn(
                'حذف',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/delete/default/20px.svg',
                () => {
                    const from = getPos()
                    view.dispatch(view.state.tr.delete(from, from + node.nodeSize))
                },
            )

            // Drag-handle
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

            /* ➍ نقطهٔ resize پایین راست */
            const dot = document.createElement('div')
            dot.style.cssText =
                'position:absolute;width:12px;height:12px;right:-6px;bottom:-6px;' +
                'background:#ddd;border:1px solid #666;border-radius:50%;cursor:nwse-resize;'
            box.append(dot)

            let sx = 0,
                sw = 0,
                aspect = 560 / 315
            dot.onmousedown = e => {
                e.preventDefault()
                sx = e.clientX
                sw = iframe.offsetWidth
                aspect = iframe.offsetWidth / iframe.offsetHeight
                const mm = mv => {
                    const w = Math.max(sw + (mv.clientX - sx), 80)
                    const h = w / aspect
                    iframe.style.width = `${w}px`
                    iframe.style.height = `${h}px`
                    box.style.width = `${w}px`
                    box.style.height = `${h}px`
                }
                const mu = () => {
                    saveSize()
                    document.removeEventListener('mousemove', mm)
                    document.removeEventListener('mouseup', mu)
                }
                document.addEventListener('mousemove', mm)
                document.addEventListener('mouseup', mu)
            }

            /* ➎ مونتاژ نهایی */
            wrap.appendChild(box)
            box.append(iframe, bar, dot)
            box.onmouseenter = () => (box.style.outline = '1px dashed #888')
            box.onmouseleave = () => (box.style.outline = 'none')

            return { dom: wrap }
        }
    },
})

/*  اگر از کلاس به‌جای استایل اینلاین استفاده کنید، در CSS سایت (یا فایل SCSS) بنویسید:
.tiptap-iframe--center { display:block; margin:0 auto; }
.tiptap-iframe--right  { float:right; margin-left:auto; }
*/
