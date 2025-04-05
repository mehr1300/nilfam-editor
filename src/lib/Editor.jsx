import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Highlight from '@tiptap/extension-highlight';
import { ListItem } from '@tiptap/extension-list-item';

import { useState } from 'react';

import ResizeImageExtension from '../extensions/ResizeImageExtension.jsx';
import ResizeVideoExtension from '../extensions/ResizeVideoExtension.jsx';
import { CustomTable, CustomTableCell, CustomTableHeader, CustomTableRow, InsertTableButton } from '../components/table/CustomTable.jsx';

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

import { FontSize } from '../extensions/FontSize.jsx';
import { FontFamily } from '../extensions/FontFamily.jsx';
import { Video } from '../extensions/Video.jsx';
import { Audio } from '../extensions/Audio.jsx';
import { LineHeightExtension } from '../extensions/LineHeightExtension.jsx';

import { t } from '../components/Lang/i18n.js';
import { Configs } from '../components/config/Configs.js';

import CodeButtons from '../components/button/CodeButtons.jsx';
import { CustomCodeBlock } from '../components/code/CustomCodeBlock.js';
import { HeadingWithAutoId } from '../extensions/HeadingWithAutoId.js';
import AnchorLinkMenu from '../components/heading/AnchorLinkMenu.jsx';
import { getHeadings } from '../components/heading/getHeadings.js';
import LinkButton from '../components/button/LinkButton.jsx';

import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
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

const Editor = ({
                    lang = 'en',
                    value,
                    onChange = () => {},
                    fonts = [],
                }) => {
    // 1) تعریف تمام stateها در ابتدای کامپوننت
    const [headingsList, setHeadingsList] = useState([]);
    const [htmlCode, setHtmlCode] = useState('');
    const [showHTML, setShowHTML] = useState(false);
    const [isTableSelected, setIsTableSelected] = useState(false);
    const [openUploadImage, setOpenUploadImage] = useState(false);
    const [openUploadVideo, setOpenUploadVideo] = useState(false);
    const [openUploadAudio, setOpenUploadAudio] = useState(false);

    // محتوای پیش‌فرض بر اساس زبان
    const defaultContent = Configs.RtlLang.includes(lang)
        ? '<p>شروع ویرایش...</p>'
        : '<p>Start editing...</p>';

    // 2) مقداردهی ادیتور با تمام اکستنشن‌ها در بالای بدنه تابع کامپوننت
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: false,
            }),
            CustomCodeBlock,
            Highlight.configure({
                multicolor: true,
            }),
            HeadingWithAutoId.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:text-blue-700',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-none pr-0 rtl:pl-0 counter-reset: item',
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-none pr-0 rtl:pl-0',
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: 'relative pl-6 rtl:pr-6 rtl:pl-0 my-1',
                },
            }),
            Image,
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
        ],
        content: value || defaultContent,
        immediatelyRender: false,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
            const newHeadings = getHeadings(editor);
            setHeadingsList(newHeadings);
        },
    });

    // اگر هنوز editor ساخته نشده باشد، می‌توان یک Loading یا null بازگرداند
    if (!editor) {
        return <div>Loading editor...</div>;
    }

    // توابع کمکی بدون استفاده از هوک:
    const bringForward = () => {
        const dom = editor.view.domAtPos(editor.state.selection.from).node;
        if (dom && dom.style) {
            let currentZ = parseInt(dom.style.zIndex) || 0;
            dom.style.zIndex = currentZ + 1;
        }
    };

    const sendBackward = () => {
        const dom = editor.view.domAtPos(editor.state.selection.from).node;
        if (dom && dom.style) {
            let currentZ = parseInt(dom.style.zIndex) || 0;
            dom.style.zIndex = currentZ - 1;
        }
    };

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
        <div
            className="relative nilfam-editor flex flex-col p-0.5 gap-0.5 border border-gray-200 rounded-xl"
            dir={Configs.RtlLang.includes(lang) ? 'rtl' : 'ltr'}
        >
            {/* نام ادیتور یا هدر کوچک */}
            <div className="add-font flex text-sm font-bold pt-1 justify-end text-gray-600 px-2">
                Nilfam-Editor
            </div>

            {/* نوار ابزار بالا */}
            <div className="add-font flex flex-col sticky top-0 z-10 bg-white p-1 border-b border-gray-200">
                {/* بخش اول نوار ابزار (فونت، هدینگ، لاین هیت و ...) */}
                <div className="flex flex-wrap items-center gap-1 mb-2">
                    <SelectFontButton editor={editor} fonts={fonts} lang={lang} />
                    <SizeFontButton editor={editor} lang={lang} />
                    <HeadingButton editor={editor} lang={lang} />
                    <LineHeightButton editor={editor} lang={lang} />
                    <AnchorLinkMenu editor={editor} headingsList={headingsList} lang={lang} />
                </div>

                {/* بخش دوم نوار ابزار (دکمه‌های بولد، رنگ، لینک، آپلود و ...) */}
                <div className="flex flex-wrap items-center gap-1">
                    <button
                        className="class-button data-active:bg-gray-300"
                        data-active={editor.isActive('bold') || null}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title={t('bold', lang)}
                    >
                        <BoldIcon />
                    </button>
                    <button
                        className="class-button data-active:bg-gray-300"
                        data-active={editor.isActive('italic') || null}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title={t('italic', lang)}
                    >
                        <ItalicIcon />
                    </button>

                    <TextColor editor={editor} lang={lang} />
                    <BorderColor editor={editor} lang={lang} />
                    <HighlightColor editor={editor} lang={lang} />

                    <LinkButton editor={editor} lang={lang} />
                    <button
                        className="class-button"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        title={t('unsetLink', lang)}
                    >
                        <LinkOffIcon />
                    </button>

                    <button
                        className="class-button"
                        onClick={() => {
                            editor.chain().focus().unsetTextStyle().clearNodes().run();
                        }}
                        title={t('clearStyle', lang)}
                    >
                        <StyleClearIcon />
                    </button>

                    <div
                        className="class-button"
                        title={t('image', lang)}
                        onClick={() => {
                            setOpenUploadImage(!openUploadImage);
                        }}
                    >
                        <PhotoIcon />
                    </div>
                    <UploadModalImage
                        editor={editor}
                        openUploadImage={openUploadImage}
                        setOpenUploadImage={setOpenUploadImage}
                        lang={lang}
                    />

                    <div
                        className="class-button"
                        title={t('video', lang)}
                        onClick={() => {
                            setOpenUploadVideo(!openUploadVideo);
                        }}
                    >
                        <MovieIcon />
                    </div>
                    <UploadModalVideo
                        editor={editor}
                        openUploadVideo={openUploadVideo}
                        setOpenUploadVideo={setOpenUploadVideo}
                        lang={lang}
                    />

                    <div
                        className="class-button"
                        title={t('audio', lang)}
                        onClick={() => {
                            setOpenUploadAudio(!openUploadAudio);
                        }}
                    >
                        <MicrophoneIcon />
                    </div>
                    <UploadModalAudio
                        editor={editor}
                        openUploadAudio={openUploadAudio}
                        setOpenUploadAudio={setOpenUploadAudio}
                        lang={lang}
                    />

                    <button
                        className="class-button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        title={t('list', lang)}
                    >
                        <ListIcon />
                    </button>
                    <button
                        className="class-button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        title={t('listNumber', lang)}
                    >
                        <ListNumberIcon />
                    </button>

                    <button
                        className="class-button"
                        onClick={() => {
                            editor.chain().focus().setTextAlign('right').run();
                        }}
                        title={t('alignRight', lang)}
                    >
                        <AlignRightIcon />
                    </button>
                    <button
                        className="class-button"
                        onClick={() => {
                            editor.chain().focus().setTextAlign('center').run();
                        }}
                        title={t('alignCenter', lang)}
                    >
                        <AlignCenterIcon />
                    </button>
                    <button
                        className="class-button"
                        onClick={() => {
                            editor.chain().focus().setTextAlign('left').run();
                        }}
                        title={t('alignLeft', lang)}
                    >
                        <AlignLeftIcon />
                    </button>
                    <button
                        className="class-button"
                        onClick={() => {
                            editor.chain().focus().setTextAlign('justify').run();
                        }}
                        title={t('justify', lang)}
                    >
                        <AlignJustifyIcon />
                    </button>

                    <button
                        className="class-button"
                        onClick={bringForward}
                        title={t('forward', lang)}
                    >
                        <IndentDecreaseIcon />
                    </button>
                    <button
                        className="class-button"
                        onClick={sendBackward}
                        title={t('backward', lang)}
                    >
                        <IndentIncreaseIcon />
                    </button>

                    <EmojiButton editor={editor} lang={lang} />
                    <InsertTableButton
                        editor={editor}
                        isTableSelected={isTableSelected}
                        setIsTableSelected={setIsTableSelected}
                        lang={lang}
                    />

                    <CodeButtons editor={editor} lang={lang} />
                    <button className="class-button" onClick={toggleHTML}>
                        {showHTML ? <SourceCodeIcon /> : <HtmlIcon />}
                    </button>

                    <MenuTable editor={editor} isTableSelected={isTableSelected} lang={lang} />
                </div>
            </div>

            {/* محتوای اصلی ادیتور یا نمایش HTML */}
            {showHTML ? (
                <textarea
                    className="bg-gray-200 p-2 min-h-[300px]"
                    rows={10}
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                />
            ) : (
                <EditorContent
                    onClick={() => !editor.isFocused && editor.chain().focus().run()}
                    editor={editor}
                    data-active={editor.isFocused || null}
                    className={`${
                        Configs.RtlLang.includes(lang) ? 'text-right' : 'text-left'
                    } p-2 data-active:ring-2 data-active:ring-red-200 min-h-[300px] bg-white !outline-none`}
                />
            )}

            {/* فوتر یا بخش پایین ادیتور */}
            <div className="add-font text-gray-400 text-sm px-2 border-t border-gray-200">
                NilfamEditor.ir
            </div>
        </div>
    );
};

export default Editor;
