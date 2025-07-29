import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'video',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    /* ─────────── Attributes ─────────── */
    addAttributes() {
        return {
            src:       { default: null },
            controls:  { default: true },
            alt:       { default: null },
            align:     { default: 'left' },    // left | center | right
            style:     { default: 'width:560px;height:auto;cursor:pointer;' },
        }
    },

    /* ─────────── Schema ─────────── */
    parseHTML() {
        return [
            {
                tag: 'video[src]',
                getAttrs: (dom) => {
                    const domStyle = dom.getAttribute('style') || '';

                    // استخراج align از استایل (برای حفظ بعد از لود)
                    let align = 'left';
                    if (domStyle.includes('margin-left:auto') && domStyle.includes('margin-right:auto')) {
                        align = 'center';
                    } else if (domStyle.includes('float:right')) {
                        align = 'right';
                    }

                    // تمیز کردن style: حذف قسمت‌های ترازبندی، نگه داشتن width/height/cursor
                    const cleanStyle = domStyle
                        .replace(/float:\s*\w+;\s*/g, '')
                        .replace(/display:\s*block;\s*/g, '')
                        .replace(/margin-left:\s*auto;\s*/g, '')
                        .replace(/margin-right:\s*auto;\s*/g, '')
                        .trim();

                    return {
                        src: dom.getAttribute('src'),
                        alt: dom.getAttribute('alt'),
                        controls: dom.hasAttribute('controls'),
                        align,
                        style: cleanStyle || 'width:560px;height:auto;cursor:pointer;',
                    };
                },
            },
        ];
    },

    /*
     * خروجی HTMLِ ذخیره‌شده
     * ↩︎  align را به استایل بلاکی تبدیل می‌کنیم
     */
    renderHTML({ HTMLAttributes }) {
        const { align = 'left', style = '' } = HTMLAttributes

        // استایلِ لازم برای ترازبندی
        const extra =
            align === 'center'
                ? 'display:block;margin-left:auto;margin-right:auto;'
                : align === 'right'
                    ? 'float:right;margin-left:auto;'
                    : 'float:left;'

        return [
            'video',
            mergeAttributes(
                HTMLAttributes,
                {
                    controls: true,            // اطمینان از وجود controls
                    style: style + extra,      // استایل قبلی + استایل ترازبندی
                    align: null,               // حذف attr منسوخ
                    // ← اگر دوست دارید کلاس بدهید:
                    // class: `tiptap-video tiptap-video--${align}`,
                },
            ),
        ]
    },

    /* ─────────── Commands ─────────── */
    addCommands() {
        return {
            insertVideo:
                attrs =>
                    ({ commands }) =>
                        commands.insertContent({ type: this.name, attrs }),
        }
    },

    /* ─────────── Node-View (داخل ادیتور) ─────────── */
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor
            const { style, align } = node.attrs

            /* ➊ wrapper flex برای نمایش چپ/وسط/راست در ادیتور */
            const wrap = document.createElement('div')
            wrap.style.cssText =
                'display:flex;width:100%;justify-content:' +
                (align === 'center'
                    ? 'center'
                    : align === 'right'
                        ? 'flex-end'
                        : 'flex-start')

            /* ➋ container اصلی */
            const box = document.createElement('div')
            box.style.cssText = `position:relative;display:inline-block;${style}`

            /* عنصر ویدئو */
            const video = document.createElement('video')
            video.setAttribute('controls', 'true')
            Object.entries(node.attrs).forEach(([k, v]) => v && video.setAttribute(k, v))

            /* ➌ نوار ابزار کوچک */
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

            /* helpers برای ذخیرهٔ تغییرات */
            const dispatch = attrs =>
                view.dispatch(
                    view.state.tr.setNodeMarkup(getPos(), null, { ...node.attrs, ...attrs }),
                )
            const saveSize  = ex => dispatch({ style: box.style.cssText, ...ex })
            const saveAlign = a  => dispatch({ align: a })

            /* ───── دکمه‌های align ───── */
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

            /* ALT */
            mkBtn(
                'alt',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/edit/default/20px.svg',
                () => {
                    const cur = video.getAttribute('alt') || ''
                    const txt = prompt('متن alt را وارد کنید:', cur)
                    if (txt !== null) {
                        video.setAttribute('alt', txt)
                        saveSize({ alt: txt })
                    }
                },
            )

            /* حذف */
            mkBtn(
                'حذف',
                'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/delete/default/20px.svg',
                () => {
                    const from = getPos()
                    view.dispatch(view.state.tr.delete(from, from + node.nodeSize))
                },
            )

            /* ───── Drag-handle ───── */
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

            /* ───── نقطهٔ resize ───── */
            const dot = document.createElement('div')
            dot.style.cssText =
                'position:absolute;width:12px;height:12px;right:-6px;bottom:-6px;' +
                'background:#ddd;border:1px solid #666;border-radius:50%;cursor:nwse-resize;'
            box.append(dot)

            let sx = 0,
                sw = 0,
                aspect = 1
            video.onloadedmetadata = () => (aspect = video.videoWidth / video.videoHeight)

            dot.onmousedown = e => {
                e.preventDefault()
                sx = e.clientX
                sw = video.offsetWidth
                const mm = mv => {
                    const w = Math.max(sw + (mv.clientX - sx), 80)
                    const h = w / aspect
                    video.style.width = `${w}px`
                    video.style.height = `${h}px`
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

            /* مونتاژ نهایی */
            wrap.appendChild(box)
            box.append(video, bar, dot)
            return { dom: wrap }
        }
    },
})