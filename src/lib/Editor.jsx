import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Highlight from '@tiptap/extension-highlight';
import {ListItem} from '@tiptap/extension-list-item';


import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import ResizeImageExtension from '../extensions/ResizeImageExtension.jsx';
import ResizeVideoExtension from '../extensions/ResizeVideoExtension.jsx';
import {CustomTable, CustomTableCell, CustomTableHeader, CustomTableRow, InsertTableButton} from '../components/table/CustomTable.jsx';

import BorderColor from '../components/button/BorderColor.jsx';
import TextColor from '../components/button/TextColor.jsx';
import HighlightColor from '../components/button/HighlightColor.jsx';
import UploadModalImage from '../components/modal/UploadModalImage.jsx';
import UploadModalVideo from '../components/modal/UploadModalVideo.jsx';
import UploadModalAudio from '../components/modal/UploadModalAudio.jsx';
import EmojiButton from '../components/button/EmojiButton.jsx';
import SelectFontButton from '../components/button/SelectFontButton.jsx';
import SizeFontButton from '../components/button/SizeFontButton.jsx';
import HeadingButton from '../components/button/HeadingButton.jsx';
import LineHeightButton from '../components/button/LineHeightButton.jsx';
import MenuTable from '../components/table/MenuTable.jsx';

import {FontSize} from '../extensions/FontSize.jsx';
import {FontFamily} from '../extensions/FontFamily.jsx';
import {Video} from '../extensions/Video.jsx';
import {Audio} from '../extensions/Audio.jsx';
import {LineHeightExtension} from '../extensions/LineHeightExtension.jsx';

import {t} from '../components/Lang/i18n.js';
import {Configs} from '../components/config/Configs.js';

import CodeButtons from '../components/button/CodeButtons.jsx';
import {CustomCodeBlock} from '../components/code/CustomCodeBlock.js';
import {HeadingWithAutoId} from '../extensions/HeadingWithAutoId.js';
import AnchorLinkMenu from '../components/heading/AnchorLinkMenu.jsx';
import {getHeadings} from '../components/heading/getHeadings.js';
import LinkButton from '../components/button/LinkButton.jsx';

import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BlockquoteIcon,
    BoldIcon,
    HtmlIcon,
    IndentDecreaseIcon,
    IndentIncreaseIcon,
    ItalicIcon,
    LinkOffIcon,
    ListIcon,
    ListNumberIcon,
    MicrophoneIcon,
    MovieIcon,
    PhotoIcon,
    SourceCodeIcon,
    StyleClearIcon,
} from '../assets/icons/Icons.jsx';
import ColoredBoxButton from "../components/button/BoxButton.jsx";
import {ColoredBox} from "../extensions/ColoredBox.js";
import ResizeIframeExtension from "../extensions/ResizeIframeExtension.jsx";
import IndentExtension from "../extensions/IndentExtension.jsx";
import CustomBlockquote from "../extensions/CustomBlockquote.jsx";

const Editor = forwardRef(({
                               isDark = false,
                               lang = "en",
                               value = "",
                               onChange = () => {},
                               fonts = [],
                           }, ref) => {
    const [headingsList, setHeadingsList] = useState([]);
    const [htmlCode, setHtmlCode] = useState('');
    const [showHTML, setShowHTML] = useState(false);
    const [isTableSelected, setIsTableSelected] = useState(false);
    const [openUploadImage, setOpenUploadImage] = useState(false);
    const [openUploadVideo, setOpenUploadVideo] = useState(false);
    const [openUploadAudio, setOpenUploadAudio] = useState(false);

    function normalizeEmptyParas(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        doc.querySelectorAll('p').forEach(p => {
            let inner = p.innerHTML.trim()
            if (
                inner === '' ||
                inner === '&nbsp;' ||
                inner === '<br class="ProseMirror-trailingBreak">'
            ) {
                p.innerHTML = '<br>'
            }
        })
        return doc.body.innerHTML
    }

    const CustomLink = Link.configure({
        openOnClick: false,            // هر تنظیم دلخواه دیگر
        HTMLAttributes: {
            class: 'tw:text-blue-600 tw:cursor-pointer tw:hover:text-blue-800',
            target: null,                // ⬅️ حتماً همین‌جا
            rel:    null,                // ⬅️ و این‌جا روی null
        },
    })


    const skipNextContentSet = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: false,
            }),
            IndentExtension.configure({ lang: lang }),
            CustomBlockquote,
            ColoredBox,
            CustomCodeBlock,
            Highlight.configure({
                multicolor: true,
            }),
            HeadingWithAutoId.configure({
                levels: [1, 2, 3, 4, 5, 6],
                HTMLAttributes: {
                    class: 'tw:font-bold tw:text-lg',
                },
            }),

            CustomLink,
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'tw:list-none tw:pr-0 tw:rtl:pl-0 tw:counter-reset: item',
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'tw:list-none pr-0 tw:rtl:pl-0',
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: 'tw:relative tw:pl-6 tw:rtl:pr-6 tw:rtl:pl-0 tw:ltr:pl-6 tw:ltr:pr-0 tw:my-1',
                },
            }),

            Video,
            Audio,
            CustomTable.configure(),
            CustomTableRow,
            CustomTableHeader,
            CustomTableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontSize,
            FontFamily,
            LineHeightExtension.configure({
                types: ['paragraph', 'heading'],
                lineHeights: ['1', '1.15', '1.5', '2', '2.5', '3'],
            }),
            ResizeImageExtension,
            ResizeVideoExtension,
            ResizeIframeExtension
            // Image,
        ],
        content: value,
        immediatelyRender: false,
        // onUpdate({ editor }) {
        //     onChange(editor.getHTML());
        //     const newHeadings = getHeadings(editor);
        //     setHeadingsList(newHeadings);
        // },
        // onUpdate({ editor }) {
        //     const rawHTML = editor.getHTML()     // چیزی که Tiptap تولید می‌کند
        //     const normalizedHTML = normalizeEmptyParas(rawHTML)
        //     onChange(normalizedHTML)
        // },
        // onUpdate({ editor }) {
        //     preserveCaretPosition(editor, () => {
        //         const rawHTML = editor.getHTML();
        //         const normalizedHTML = normalizeEmptyParas(rawHTML);
        //         editor.commands.setContent(normalizedHTML, false); // false برای جلوگیری از trigger کردن onUpdate دوباره
        //     });
        //     onChange(editor.getHTML())
        // },
        onUpdate({ editor }) {
            const newHeadings = getHeadings(editor);
            setHeadingsList(newHeadings);

            const normalized = normalizeEmptyParas(editor.getHTML());
            // از داخل ادیتور به والد می‌فرستیم
            skipNextContentSet.current = true;      // یعنی این تغییر داخلی است
            onChange(normalized);
        },
        editorProps: {
            attributes: {style: ` min-height: 300px; cursor: text; outline: none;`},
            //غیر فعال کردم برای رفع مشکل سلکت کردن
            // handleClick(view) {
            //     if (view.hasFocus()) return true
            //     return false
            // },
        },
    });

    // useEffect(() => {
    //     if (editor && value !== undefined) {
    //         if (editor.getHTML() !== value) {
    //             editor.commands.setContent(value);
    //         }
    //     }
    // }, [editor, value]);

    // متدهایی که از طریق ref در دسترس قرار می‌دیم
    useImperativeHandle(ref, () => ({
        insertContent: (content) => {
            if (editor) {
                editor.chain().focus().insertContent(content).run();
            }
        },
    }));

    useEffect(() => {
        if (!editor || value === undefined) return;

        // اگر همین لحظه از ادیتور آمده، پرچم را خنثی کن و چیزی ننویس
        if (skipNextContentSet.current) {
            skipNextContentSet.current = false;
            return;
        }

        // فقط وقتی واقعاً یک تغییر بیرونی بود
        if (editor.getHTML() !== value) {
            editor.commands.setContent(value);    // محتوا را جایگزین کن
        }
    }, [editor, value]);

    if (!editor) {
        return <div>Loading editor...</div>;
    }


    // سوییچ بین نمایش HTML و WYSIWYG
    const toggleHTML = () => {
        if (!showHTML) {
            let rawHTML = editor.getHTML();
            // اضافه کردن یک خط جدید بین تگ‌ها (صرفاً برای خواناتر شدن)
            rawHTML = rawHTML.replace(/></g, '>\n<');
            setHtmlCode(rawHTML);
            setShowHTML(true);
        } else {
            editor.commands.setContent(htmlCode);
            setShowHTML(false);
        }
    };

    return (
        <div data-theme={isDark ? 'dark' : 'light'}
            className="tw:dark:bg-gray-900 tw:relative tw:nilfam-editor tw:flex tw:flex-col tw:p-0.5 tw:gap-0.5 tw:border tw:border-gray-200 tw:dark:border-gray-700 tw:rounded-xl"
            dir={Configs.RtlLang.includes(lang) ? 'rtl' : 'ltr'}
        >
            {/* نام ادیتور یا هدر کوچک */}
            <div className="tw:add-font tw:dark:text-gray-200 tw:flex tw:text-sm tw:font-bold tw:pt-1 tw:justify-end tw:ltr:justify-start  tw:text-gray-600 tw:px-2">
                Nilfam-Editor
            </div>

            {/* نوار ابزار بالا */}
            <div className="tw:add-font tw:flex tw:flex-col tw:sticky tw:top-0 tw:z-10 tw:bg-white tw:dark:bg-gray-600 tw:p-1 tw:border-b tw:border-gray-200 tw:dark:border-gray-600">
                {/* بخش اول نوار ابزار (فونت، هدینگ، لاین هیت و ...) */}
                <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-1 tw:mb-2">
                    <SelectFontButton editor={editor} fonts={fonts} lang={lang} />
                    <SizeFontButton editor={editor} lang={lang} />
                    <HeadingButton editor={editor} lang={lang} />
                    <LineHeightButton editor={editor} lang={lang} />
                    <AnchorLinkMenu editor={editor} headingsList={headingsList} getHeadings={getHeadings} lang={lang} />
                </div>

                {/* بخش دوم نوار ابزار (دکمه‌های بولد، رنگ، لینک، آپلود و ...) */}
                <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-1">
                    <div className="class-button tw:data-active:bg-gray-300 tw:dark:data-active:bg-gray-700" data-active={editor.isActive('bold') || null} onClick={() => editor.chain().focus().toggleBold().run()} title={t('bold', lang)}>
                        <BoldIcon />
                    </div>
                    <div className="class-button tw:data-active:bg-gray-300 tw:dark:data-active:bg-gray-700" data-active={editor.isActive('italic') || null} onClick={() => editor.chain().focus().toggleItalic().run()} title={t('italic', lang)}>
                        <ItalicIcon />
                    </div>

                    <TextColor editor={editor} lang={lang} />
                    <BorderColor editor={editor} lang={lang} />
                    <HighlightColor editor={editor} lang={lang} />

                    <LinkButton editor={editor} lang={lang} />
                    <div className="class-button" onClick={() => editor.chain().focus().unsetLink().run()} title={t('unsetLink', lang)}>
                        <LinkOffIcon />
                    </div>

                    <div className="class-button" onClick={() => editor.chain().focus().unsetTextStyle().clearNodes().run()} title={t('clearStyle', lang)}>
                        <StyleClearIcon />
                    </div>

                    <div className="class-button" title={t('image', lang)} onClick={() => setOpenUploadImage(!openUploadImage)}>
                        <PhotoIcon />
                    </div>
                    <UploadModalImage editor={editor} openUploadImage={openUploadImage} setOpenUploadImage={setOpenUploadImage} lang={lang}/>

                    <div className="class-button" title={t('video', lang)} onClick={() => setOpenUploadVideo(!openUploadVideo)}>
                        <MovieIcon />
                    </div>
                    <UploadModalVideo editor={editor} openUploadVideo={openUploadVideo} setOpenUploadVideo={setOpenUploadVideo} lang={lang}/>

                    <div className="class-button" title={t('audio', lang)} onClick={() => setOpenUploadAudio(!openUploadAudio)}>
                        <MicrophoneIcon />
                    </div>
                    <UploadModalAudio editor={editor} openUploadAudio={openUploadAudio} setOpenUploadAudio={setOpenUploadAudio} lang={lang}/>

                    <div className="class-button" onClick={() => editor.chain().focus().toggleBulletList().run()} title={t('list', lang)}>
                        <ListIcon />
                    </div>
                    <div className="class-button" onClick={() => editor.chain().focus().toggleOrderedList().run()} title={t('listNumber', lang)}>
                        <ListNumberIcon />
                    </div>

                    <div className="class-button" onClick={() => editor.chain().focus().setTextAlign('right').run()} title={t('alignRight', lang)}>
                        <AlignRightIcon />
                    </div>
                    <div className="class-button" onClick={() => editor.chain().focus().setTextAlign('center').run()} title={t('alignCenter', lang)}>
                        <AlignCenterIcon />
                    </div>
                    <div className="class-button" onClick={() => editor.chain().focus().setTextAlign('left').run()} title={t('alignLeft', lang)}>
                        <AlignLeftIcon />
                    </div>
                    <div className="class-button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} title={t('justify', lang)}>
                        <AlignJustifyIcon />
                    </div>

                    <div className="class-button" onClick={() => editor.chain().focus().indent().run()} title={t('forward', lang)}>
                        <IndentDecreaseIcon />
                    </div>
                    <div className="class-button" onClick={() => editor.chain().focus().outdent().run()} title={t('backward', lang)}>
                        <IndentIncreaseIcon />
                    </div>
                    <div className="class-button" onClick={() => editor.chain().focus().toggleBlockquote().run()} title={t('blockquote', lang)}>
                        <BlockquoteIcon />
                    </div>

                    <EmojiButton editor={editor} lang={lang} />
                    <InsertTableButton editor={editor} isTableSelected={isTableSelected} setIsTableSelected={setIsTableSelected} lang={lang}/>

                    <CodeButtons editor={editor} lang={lang} />
                    <div className="class-button" onClick={toggleHTML}>
                        {showHTML ? <SourceCodeIcon /> : <HtmlIcon />}
                    </div>

                    <MenuTable editor={editor} isTableSelected={isTableSelected} lang={lang} />

                    <ColoredBoxButton editor={editor} lang={lang} />
                    ///مشکل سیو شدن در جدول
                    // مشکل صوت
                    //مشکل آیکون و تعویض بهضی

                </div>
            </div>

            {showHTML ? (
                <textarea
                    className="tw:bg-gray-200 tw:dark:bg-gray-800 tw:p-2 tw:min-h-[300px] tw:dark:text-gray-300 "
                    rows={10}
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                />
            ) : (
                <EditorContent
                    // onClick={() => !editor.isFocused && editor.chain().focus().run()}
                    editor={editor}
                    data-active={editor.isFocused || null}
                    className={`${
                        Configs.RtlLang.includes(lang) ? 'tw:text-right' : 'tw:text-left'
                    } tw:p-2 tw:dark:text-gray-300 tw:data-active:ring-2 tw:data-active:ring-red-200 tw:dark:data-active:ring-red-300 tw:min-h-[300px] tw:bg-white tw:dark:bg-gray-800 tw:!outline-none`}
                />
            )}

            {/* فوتر یا بخش پایین ادیتور */}
            <div className="tw:dark:text-gray-500 tw:add-font tw:text-gray-400 tw:text-sm tw:px-2 tw:border-t tw:border-gray-200 tw:dark:border-gray-600">
                NilfamEditor.ir
            </div>
        </div>
    );
});

export default Editor;
