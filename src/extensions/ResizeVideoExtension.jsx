import { Node } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'

/**
 * این اکستنشن نامش همان "video" است، پس اگر می‌خواهید
 * به جای نود قبلی‌تان قرار بگیرد، کافی است نود قبلی را حذف کنید.
 * یا اگر دوست دارید اسم دیگری داشته باشد، مقدار name را تغییر دهید.
 */
const ResizeVideoExtension = Node.create({
    name: 'video',

    group: 'block',
    selectable: true,
    atom: true,

    addAttributes() {
        return {
            src: {},
            controls: { default: true },
            /**
             * alt معمولا برای ویدئو کمتر استفاده می‌شود، اما اگر نیاز دارید
             * همانند عکس، متن جایگزین درج شود، اینجا تعریفش می‌کنیم.
             */
            alt: { default: null },

            /**
             * استایل پیش‌فرض. از آنجا که می‌خواهیم قابلیت تغییر سایز داشته باشیم،
             * عرض و ارتفاع را در CSS کنترل می‌کنیم و اینجا قرار می‌دهیم.
             */
            style: {
                default: 'width: 100%; height: auto; cursor: pointer;',
                parseHTML: element => {
                    // اگر عنصری به اسم width داشته باشد، آن را تبدیل به استایل می‌کنیم
                    const width = element.getAttribute('width')
                    return width
                        ? `width: ${width}px; height: auto; cursor: pointer;`
                        : element.style.cssText
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'video',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        // همواره controls را true می‌کنیم؛ می‌توانید سفارشی کنید
        return ['video', mergeAttributes(HTMLAttributes, { controls: true }), 0]
    },

    addCommands() {
        return {
            insertVideo:
                options =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },

    /**
     * اینجا همان منطق NodeView را اضافه می‌کنیم تا ویدئوها قابلیت ریسایز و موقعیت‌دهی داشته باشند.
     */
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor
            const { style } = node.attrs

            // یک div ریشه که container ما را در بر می‌گیرد
            const $wrapper = document.createElement('div')
            $wrapper.classList.add('flex')

            // کانتینر اصلی
            const $container = document.createElement('div')
            $container.classList.add('relative', 'cursor-pointer')
            $container.setAttribute('style', style)

            // عنصر ویدئو
            const $video = document.createElement('video')
            $video.setAttribute('controls', 'true')

            // تابعی برای بروزرسانی نود در State
            const dispatchNodeView = (extraAttrs = {}) => {
                if (typeof getPos === 'function') {
                    const newAttrs = {
                        ...node.attrs,
                        style: $video.style.cssText, // حتماً استایل جدید را ذخیره کنیم
                        ...extraAttrs,
                    }
                    view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs))
                }
            }

            // ابزار موقعیت‌دهی
            const paintPositionController = () => {
                const $positionController = document.createElement('div')
                $positionController.classList.add(
                    'absolute',
                    'top-0',
                    'left-1/2',
                    'w-[130px]',
                    'h-[25px]',
                    'z-[999]',
                    'py-4',
                    'px-2',
                    'bg-white',
                    'rounded',
                    'border-1',
                    'border-gray-400',
                    'cursor-pointer',
                    'transform',
                    '-translate-x-1/2',
                    '-translate-y-1/2',
                    'flex',
                    'justify-between',
                    'items-center',
                )

                const iconClasses = ['w-6', 'h-6', 'cursor-pointer',"hover:bg-gray-200" , "p-0.5"]

                // دکمه راست‌چین
                const $rightController = document.createElement('img')
                $rightController.classList.add(...iconClasses)
                $rightController.setAttribute(
                    'src',
                    'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg'
                )
                $rightController.addEventListener('click', () => {
                    $video.style.margin = '0 0 0 auto'
                    dispatchNodeView()
                })

                // دکمه وسط‌چین
                const $centerController = document.createElement('img')
                $centerController.classList.add(...iconClasses)
                $centerController.setAttribute(
                    'src',
                    'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg'
                )
                $centerController.addEventListener('click', () => {
                    $video.style.margin = '0 auto'
                    dispatchNodeView()
                })

                // دکمه چپ‌چین
                const $leftController = document.createElement('img')
                $leftController.classList.add(...iconClasses)
                $leftController.setAttribute(
                    'src',
                    'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg'
                )
                $leftController.addEventListener('click', () => {
                    $video.style.margin = '0 auto 0 0'
                    dispatchNodeView()
                })

                // دکمه alt (در اصل برای ویدئو متداول نیست، ولی طبق خواسته شما)
                const $altController = document.createElement('img')
                $altController.classList.add(...iconClasses)
                $altController.setAttribute(
                    'src',
                    'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/edit/default/20px.svg'
                )
                $altController.addEventListener('click', () => {
                    const currentAlt = $video.getAttribute('alt') || ''
                    const newAlt = prompt('متن جایگزین (alt) را وارد کنید:', currentAlt)
                    if (newAlt !== null) {
                        $video.setAttribute('alt', newAlt)
                        dispatchNodeView({ alt: newAlt })
                    }
                })

                $positionController.appendChild($rightController)
                $positionController.appendChild($centerController)
                $positionController.appendChild($leftController)
                $positionController.appendChild($altController)

                $container.appendChild($positionController)
            }

            // الحاق عناصر
            $wrapper.appendChild($container)
            $container.appendChild($video)

            // منتقل کردن اتربیوت‌های نود (src, alt, style و ...)
            Object.entries(node.attrs).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    $video.setAttribute(key, value)
                }
            })

            // بعد از لود شدن ویدئو، نسبت تصویر را استخراج می‌کنیم.
            let originalWidth = 0
            let originalHeight = 0
            let aspectRatio = 1

            $video.addEventListener('loadedmetadata', () => {
                originalWidth = $video.videoWidth
                originalHeight = $video.videoHeight
                aspectRatio = originalWidth / originalHeight
            })

            // متغیرهای ریسایز
            let isResizing = false
            let startX = 0
            let startWidth = 0

            const onMouseMove = e => {
                if (!isResizing) return
                const deltaX = e.clientX - startX
                // با توجه به موقعیت دستگیره، فرمول را می‌توان برعکس کرد
                const newWidth = startWidth - deltaX
                const newHeight = newWidth / aspectRatio

                $video.style.width = `${Math.max(newWidth, 10)}px`
                $video.style.height = `${Math.max(newHeight, 10)}px`
                $container.style.width = `${Math.max(newWidth, 10)}px`
                $container.style.height = `${Math.max(newHeight, 10)}px`
            }

            const onMouseUp = () => {
                if (isResizing) isResizing = false
                dispatchNodeView()
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            // با کلیک روی کانتینر، نقاط ریسایز و ابزار موقعیت‌دهی را نمایش بده
            $container.addEventListener('click', () => {
                paintPositionController()
                $container.setAttribute(
                    'style',
                    `position: relative; border: 1.5px dashed #6C6C6C; ${style}`
                )

                const dotPosition = '-6px'
                const dotsPosition = [
                    `top: ${dotPosition}; left: ${dotPosition}; cursor: nwse-resize;`,
                    `top: ${dotPosition}; right: ${dotPosition}; cursor: nesw-resize;`,
                    `bottom: ${dotPosition}; left: ${dotPosition}; cursor: nesw-resize;`,
                    `bottom: ${dotPosition}; right: ${dotPosition}; cursor: nwse-resize;`,
                ]

                Array.from({ length: 1 }, (_, index) => {
                    const $dot = document.createElement('div')
                    $dot.classList.add(
                        'absolute',
                        'w-[12px]',
                        'h-[12px]',
                        'border',
                        'border-gray-600',
                        'bg-gray-200',
                        'rounded-full'
                    )
                    $dot.setAttribute(
                        'style',
                        `${dotsPosition[index]} border-width:1.5px;`
                    )

                    // رویداد موس
                    $dot.addEventListener('mousedown', e => {
                        e.preventDefault()
                        isResizing = true
                        startX = e.clientX
                        startWidth = $video.offsetWidth

                        document.addEventListener('mousemove', onMouseMove)
                        document.addEventListener('mouseup', onMouseUp)
                    })

                    $container.appendChild($dot)
                })
            })

            // اگر بیرون از کانتینر کلیک شد، ابزارها مخفی شوند
            document.addEventListener('click', e => {
                if (!$container.contains(e.target)) {
                    // حذف استایل انتخاب
                    $container.setAttribute('style', `${style}`)
                    // حذف کنترلرها در صورت تمایل
                    // مثلاً:
                    // $container.querySelectorAll('.absolute').forEach(el => el.remove())
                }
            })

            return {
                dom: $wrapper,
            }
        }
    },
})

export default ResizeVideoExtension
