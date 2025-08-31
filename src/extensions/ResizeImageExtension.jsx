import { Image } from '@tiptap/extension-image';

const ResizeImageExtension = Image.extend({
    name: 'resizeImage',

    addAttributes() {
        return {
            ...this.parent?.(),
            style: {
                default: 'width: 100%; max-width: 100%; height: auto; cursor: pointer;',
                parseHTML: element => {
                    const width = element.getAttribute('width');
                    const parsedStyle = width
                        ? `width: ${width}px; max-width: 100%; height: auto; cursor: pointer;`
                        : element.style.cssText;
                    // Ensure height is auto and max-width is present
                    let styleObj = {};
                    parsedStyle.split(';').forEach(part => {
                        const [key, value] = part.split(':').map(s => s.trim());
                        if (key) styleObj[key] = value;
                    });
                    styleObj.height = 'auto';
                    if (!styleObj['max-width']) styleObj['max-width'] = '100%';
                    return Object.entries(styleObj).map(([k, v]) => `${k}: ${v};`).join(' ');
                },
            },
            loading: {
                default: 'lazy',
                parseHTML: element => element.getAttribute('loading'),
            },
        };
    },

    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view } = editor;
            const { style, loading } = node.attrs;

            // ریشه‌ی اصلی گره
            const $wrapper = document.createElement('div');
            $wrapper.classList.add('tw:flex');

            // کانتینری که قرار است عکس و کنترل‌ها در آن باشند
            const $container = document.createElement('div');
            $container.classList.add('tw:relative', 'tw:cursor-pointer');

            // عنصری که عکس را نگه می‌دارد
            const $img = document.createElement('img');

            // به‌روزرسانی نود در State تیپ‌تپ
            const dispatchNodeView = (extraAttrs = {}) => {
                if (typeof getPos === 'function') {
                    const currentStyle = $img.style;
                    let styleString = '';
                    if (currentStyle.width) styleString += `width: ${currentStyle.width}; `;
                    styleString += 'max-width: 100%; height: auto; ';
                    if (currentStyle.margin) styleString += `margin: ${currentStyle.margin}; `;
                    if (currentStyle.borderRadius) styleString += `border-radius: ${currentStyle.borderRadius}; `;
                    if (currentStyle.cursor) styleString += `cursor: ${currentStyle.cursor}; `;

                    const newAttrs = {
                        ...node.attrs,
                        style: styleString.trim(),
                        ...extraAttrs,
                    };
                    view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs));
                }
            };

            // تابع برای ساخت SVG از Icons.jsx
            const createSvgElement = (svgContent) => {
                const div = document.createElement('div');
                div.innerHTML = svgContent;
                return div.firstElementChild;
            };

            // کنترل موقعیت (چپ، وسط، راست) و دکمه‌ی alt
            const paintPositionController = () => {
                const $positionController = document.createElement('div');
                $positionController.classList.add(
                    'tw:absolute',
                    'tw:top-0',
                    'tw:left-1/2',
                    'tw:w-[170px]',
                    'tw:h-[28px]',
                    'tw:z-[999]',
                    'tw:py-4',
                    'tw:px-2',
                    'tw:dark:bg-gray-600',
                    'tw:bg-white',
                    'tw:rounded',
                    'tw:border-1',
                    'tw:border-gray-400',
                    'tw:cursor-pointer',
                    'tw:transform',
                    'tw:-translate-x-1/2',
                    'tw:-translate-y-1/2',
                    'tw:flex',
                    'tw:justify-between',
                    'tw:items-center'
                );

                const iconClasses = ['tw:w-6', 'tw:h-6', 'tw:cursor-pointer','tw:dark:hover:bg-gray-800', 'tw:hover:bg-gray-200', 'tw:p-0.5'];

                // دکمه چپ‌چین
                const $leftController = createSvgElement(`
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-align-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l10 0" /><path d="M4 18l14 0" /></svg>
                `);
                $leftController.classList.add(...iconClasses);
                $leftController.addEventListener('click', () => {
                    $img.style.margin = '0 auto 0 0';
                    dispatchNodeView();
                });

                // دکمه وسط‌چین
                const $centerController = createSvgElement(`
                   <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-align-center"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M8 12l8 0" /><path d="M6 18l12 0" /></svg>
                `);
                $centerController.classList.add(...iconClasses);
                $centerController.addEventListener('click', () => {
                    $img.style.margin = '0 auto';
                    dispatchNodeView();
                });

                // دکمه راست‌چین
                const $rightController = createSvgElement(`
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-align-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M10 12l10 0" /><path d="M6 18l14 0" /></svg>
                `);
                $rightController.classList.add(...iconClasses);
                $rightController.addEventListener('click', () => {
                    $img.style.margin = '0 0 0 auto';
                    dispatchNodeView();
                });

                // دکمه تغییر alt (با یک آیکون ساده edit)
                const $altController = createSvgElement(`
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-photo-ai"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M10 21h-4a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l1 1" /><path d="M14 21v-4a2 2 0 1 1 4 0v4" /><path d="M14 19h4" /><path d="M21 15v6" /></svg>
                `);
                $altController.classList.add(...iconClasses);
                $altController.addEventListener('click', () => {
                    const currentAlt = $img.getAttribute('alt') || '';
                    const newAlt = prompt('متن جایگزین (alt) را وارد کنید:', currentAlt);

                    if (newAlt !== null) {
                        $img.setAttribute('alt', newAlt);
                        dispatchNodeView({ alt: newAlt });
                    }
                });

                // دکمه بردر (با امکان وارد کردن مقدار)
                const $borderController = createSvgElement(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo-circle-plus">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M15 8h.01" />
                        <path d="M20.964 12.806a9 9 0 0 0 -8.964 -9.806a9 9 0 0 0 -9 9a9 9 0 0 0 9.397 8.991" />
                        <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4" />
                        <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" />
                        <path d="M16 19.33h6" />
                        <path d="M19 16.33v6" />
                    </svg>
                `);
                $borderController.classList.add(...iconClasses);
                $borderController.addEventListener('click', () => {
                    const currentBorderRadius = $img.style.borderRadius || '0';
                    const newBorderRadius = prompt('مقدار گردی گوشه‌ها (به px یا %) را وارد کنید:', currentBorderRadius);
                    if (newBorderRadius !== null) {
                        // بررسی و اضافه کردن واحد اگر کاربر وارد نکرده باشه
                        const value = /^\d+$/.test(newBorderRadius) ? `${newBorderRadius}px` : newBorderRadius;
                        $img.style.borderRadius = value;
                        dispatchNodeView();
                    }
                });

                // دکمه حذف بردر
                const $borderNoController = createSvgElement(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo-circle-minus">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M15 8h.01" />
                        <path d="M20.475 15.035a9 9 0 0 0 -8.475 -12.035a9 9 0 0 0 -9 9a9 9 0 0 0 9.525 8.985" />
                        <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4" />
                        <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2 2" />
                        <path d="M16 19h6" />
                    </svg>
                `);
                $borderNoController.classList.add(...iconClasses);
                $borderNoController.addEventListener('click', () => {
                    $img.style.borderRadius = '0';
                    dispatchNodeView();
                });

                // افزودن دکمه‌ها به کنترلر
                $positionController.appendChild($altController);
                $positionController.appendChild($rightController);
                $positionController.appendChild($centerController);
                $positionController.appendChild($leftController);
                $positionController.appendChild($borderController);
                $positionController.appendChild($borderNoController);

                $container.appendChild($positionController);
            };

            // الحاق عناصر
            $wrapper.appendChild($container);
            $container.setAttribute('style', style);
            $container.appendChild($img);

            // انتقال اتربیوت‌های نود (مثل src, alt و ...)
            Object.entries(node.attrs).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    $img.setAttribute(key, value);
                }
            });

            // تنظیم height به auto همیشه
            $img.style.height = 'auto';
            $container.style.height = 'auto';

            // متغیرهای تغییر اندازه
            let isResizing = false;
            let startX = 0;
            let startWidth = 0;
            let aspectRatio = 1;

            $img.addEventListener('load', () => {
                aspectRatio = $img.naturalWidth / $img.naturalHeight;
            });

            const onMouseMove = e => {
                if (!isResizing) return;
                const deltaX = e.clientX - startX;
                const newWidth = startWidth - deltaX;
                $img.style.width = `${Math.max(newWidth, 10)}px`;
                $img.style.height = 'auto';
                $container.style.width = 'auto';
                $container.style.height = 'auto';
            };

            const onMouseUp = () => {
                if (isResizing) isResizing = false;
                dispatchNodeView();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            // کلیک روی عکس: نمایش ابزار موقعیت‌دهی و نقاط تغییر سایز
            $container.addEventListener('click', () => {
                paintPositionController();

                // افزودن کلاس‌ها و استایل مخصوص حالت انتخاب
                $container.setAttribute(
                    'style',
                    `position: relative;border: 1.5px dashed #6C6C6C; ${style}`
                );

                // نقاط تغییر اندازه
                const dotPosition = '-6px';
                const dotsPosition = [
                    `top: ${dotPosition}; left: ${dotPosition}; cursor: nwse-resize;`,
                    `top: ${dotPosition}; right: ${dotPosition}; cursor: nesw-resize;`,
                    `bottom: ${dotPosition}; left: ${dotPosition}; cursor: nesw-resize;`,
                    `bottom: ${dotPosition}; right: ${dotPosition}; cursor: nwse-resize;`,
                ];

                Array.from({ length: 4 }, (_, index) => {
                    const $dot = document.createElement('div');
                    $dot.classList.add(
                        'tw:absolute',
                        'tw:w-[12px]',
                        'tw:h-[12px]',
                        'tw:border',
                        'tw:border-gray-600',
                        'tw:bg-gray-200',
                        'tw:zrounded-full'
                    );
                    $dot.setAttribute(
                        'style',
                        `${dotsPosition[index]} border-width:1.5px;`
                    );

                    $dot.addEventListener('mousedown', e => {
                        e.preventDefault();
                        isResizing = true;
                        startX = e.clientX;
                        startWidth = $img.offsetWidth;

                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });

                    $container.appendChild($dot);
                });
            });

            // اگر بیرون از کانتینر کلیک شد، ابزارهای کمکی حذف شوند
            document.addEventListener('click', e => {
                if (!$container.contains(e.target)) {
                    $container.setAttribute('style', `${style}`);
                }
            });

            return {
                dom: $wrapper,
            };
        };
    },

    renderHTML({ node }) {
        const attrs = { ...node.attrs };
        if (attrs.style) {
            attrs.style += ' max-width: 100%; height: auto;';
        } else {
            attrs.style = 'max-width: 100%; height: auto;';
        }
        return ['img', attrs];
    },
});

export default ResizeImageExtension;