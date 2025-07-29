import { Node, mergeAttributes } from '@tiptap/core'

/*
 * اکستنشن آیفریم — نسخهٔ ساده، تمیز و واکنش‌گرا بدون خطاهای نحوی
 * --------------------------------------------------------------
 * ● عرض اولیه ۵۶۰px (مثل یوتیوب) — مشاهدهٔ دقیق در ادیتور
 * ● نسبت ۱۶:۹ با <aspect-ratio> + فاو‌بک در CSS
 * ● در خروجی سایت: 100% عرض ستون + max-width برابر اندازهٔ انتخاب‌شده ⇒ پاسخ‌گو
 * ● Resize در ادیتور فقط عرض را تغییر می‌دهد (px)؛ ارتفاع خودکار است.
 * ● دکمه‌های تراز، ALT، حذف، Drag‑handle.
 */
export default Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    /* ───────── Attributes ───────── */
    addAttributes() {
        return {
            src:   { default: null },
            alt:   { default: null },
            align: { default: 'left' },   // left | center | right
            width: { default: 560 },      // px — فقط برای نمایش در ادیتور و حدّ بزرگ شدن
            allowfullscreen: { default: '' },
            allow: { default: 'fullscreen; picture-in-picture; autoplay' },
        }
    },

    /* ───────── Schema ───────── */
    parseHTML() {
        return [
            {
                tag: 'iframe[src]',
                getAttrs: (dom) => ({
                    src: dom.getAttribute('src'),
                    alt: dom.getAttribute('alt'),
                    align: dom.getAttribute('data-align') || 'left',
                    width: parseInt(dom.getAttribute('data-width')) || 560,
                    allowfullscreen: dom.hasAttribute('allowfullscreen') ? '' : null,
                    allow: dom.getAttribute('allow') || 'fullscreen; picture-in-picture; autoplay',
                }),
            },
        ]
    },

    /* ───────── renderHTML (خروجی سایت) ───────── */
    renderHTML({ HTMLAttributes }) {
        const { align = 'left', width = 560 } = HTMLAttributes

        // ظرف واکنش‌گرا: عرض کامل ستون تا سقفِ width انتخابی
        const wrapStyle =
            `position:relative;width:100%;max-width:${width}px;aspect-ratio:16/9;` +
            (align === 'center'
                ? 'display:block;margin-inline:auto;'
                : align === 'right'
                    ? 'float:right;margin-left:auto;'
                    : 'float:left;')

        const iframeStyle = 'position:absolute;inset:0;width:100%;height:100%;border:0;'

        return [
            'div',
            { class: 'responsive-iframe', style: wrapStyle },
            [
                'iframe',
                mergeAttributes(
                    HTMLAttributes,
                    {
                        style: iframeStyle,
                        align: null,               // صفت منسوخ
                        'data-align': align,       // ذخیره برای parse
                        'data-width': width,       // ذخیره برای parse
                        allowfullscreen: '',
                        allow: HTMLAttributes.allow,
                    },
                ),
            ],
        ]
    },

    /* ───────── Commands ───────── */
    addCommands() {
        return {
            insertIframe:
                attrs => ({ commands }) => commands.insertContent({ type: this.name, attrs }),
        }
    },

    /* ───────── Node‑View (ادیتور WYSIWYG) ───────── */
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor
            const { align, width } = node.attrs

            /* wrapper برای تراز */
            const outer = document.createElement('div')
            outer.style.cssText =
                'display:flex;width:100%;justify-content:' +
                (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start')

            /* ظرف 16:9 در ادیتور با عرض ثابت */
            const box = document.createElement('div')
            box.style.cssText = `position:relative;width:${width}px;max-width:100%;aspect-ratio:16/9;`

            /* IFRAME */
            const iframe = document.createElement('iframe')
            iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;'
            Object.entries(node.attrs).forEach(([k, v]) => {
                if (v == null) return
                if (k === 'allowfullscreen') { iframe.setAttribute('allowfullscreen', ''); return }
                if (['align', 'width'].includes(k)) return // این‌ها فقط متادیتای ظرفند
                iframe.setAttribute(k, v)
            })

            /* نوار ابزار */
            const toolbar = document.createElement('div')
            toolbar.style.cssText =
                'position:absolute;top:0;left:50%;transform:translate(-50%,-100%);' +
                'display:flex;gap:4px;padding:2px 4px;background:#fff;border:1px solid #888;' +
                'border-radius:4px;font-size:0;z-index:20;'

            const mkBtn = (title, svg, fn) => {
                const b = document.createElement('span')
                b.title = title
                b.style.cssText =
                    'width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;' +
                    'cursor:pointer;border-radius:4px;'
                b.innerHTML = `<img src="${svg}" width="20" height="20">`
                b.onclick = fn
                toolbar.appendChild(b)
            }

            /* helpers */
            const dispatch = attrs => view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, { ...node.attrs, ...attrs }))
            const saveWidth = w => dispatch({ width: w })
            const saveAlign = a => dispatch({ align: a })

            /* دکمه‌ها */
            mkBtn('چپ','https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg',
                () => { outer.style.justifyContent='flex-start'; saveAlign('left') })
            mkBtn('وسط','https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg',
                () => { outer.style.justifyContent='center';     saveAlign('center') })
            mkBtn('راست','https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg',
                () => { outer.style.justifyContent='flex-end';   saveAlign('right') })
            mkBtn('alt','https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/edit/default/20px.svg',
                () => { const cur=iframe.getAttribute('alt')||''; const t=prompt('متن alt را وارد کنید:',cur); if(t!==null){ iframe.setAttribute('alt',t); dispatch({alt:t}) } })
            mkBtn('حذف','https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/delete/default/20px.svg',
                () => { const from=getPos(); view.dispatch(view.state.tr.delete(from,from+node.nodeSize)) })

            /* Drag‑handle */
            const drag = document.createElement('span')
            drag.title='جابجایی'
            drag.classList.add('ProseMirror-drag-handle')
            drag.setAttribute('draggable','true')
            drag.style.cssText = 'width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;cursor:grab;border-radius:4px;'
            drag.innerHTML='<img src="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/open_with/default/20px.svg" width="20" height="20">'
            toolbar.appendChild(drag)

            /* نقطهٔ Resize */
            const dot = document.createElement('div')
            dot.style.cssText = 'position:absolute;width:12px;height:12px;right:-6px;bottom:-6px;background:#ddd;border:1px solid #666;border-radius:50%;cursor:nwse-resize;z-index:15;'
            let startX = 0, startW = width
            dot.onmousedown = e => {
                e.preventDefault(); e.stopPropagation()
                startX = e.clientX
                startW = box.offsetWidth
                const mm = mv => {
                    const w = Math.max(startW + (mv.clientX - startX), 200)
                    box.style.width = w + 'px'
                }
                const mu = () => {
                    const finalW = parseInt(box.style.width)
                    saveWidth(finalW)
                    document.removeEventListener('mousemove', mm)
                    document.removeEventListener('mouseup', mu)
                }
                document.addEventListener('mousemove', mm)
                document.addEventListener('mouseup', mu)
            }

            /* مونتاژ */
            outer.appendChild(box)
            box.append(iframe, toolbar, dot)
            box.onmouseenter = () => box.style.outline='1px dashed #888'
            box.onmouseleave = () => box.style.outline='none'

            return { dom: outer }
        }
    },
})