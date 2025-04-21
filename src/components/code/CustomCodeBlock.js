// CustomCodeBlock.js
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CodeBlockComponent from './CodeBlockComponent.jsx'

import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import php from 'highlight.js/lib/languages/php';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/rust';
import xml from 'highlight.js/lib/languages/xml';

// مقدار lowlight را بسازید و زبان‌ها را ثبت کنید
const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('python', python);
lowlight.register('css', css);
lowlight.register('html', xml);
lowlight.register('php', php);
lowlight.register('rust', rust);
lowlight.register('go', go);

export const CustomCodeBlock = CodeBlockLowlight
    .extend({
        addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent)
        },
    })
    .configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
            class: 'code-block',
        },
    })
