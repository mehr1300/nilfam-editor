import {Extension} from "@tiptap/core";

export const FormatPainterExtension = Extension.create({
    name: 'formatPainter',

    addStorage() {
        return {
            copiedMarks: [], // لیست marks فعال با attributesشون
            copiedAttributes: null, // attributes از textStyle
        };
    },

    addCommands() {
        return {
            copyFormat: () => ({ editor }) => {
                // لیست marks رایج
                const markTypes = ['bold', 'italic', 'underline', 'highlight', 'link', 'code']; // اضافه کن اگر بیشتر داری

                const copiedMarks = markTypes
                    .filter(markName => editor.isActive(markName)) // چک فعال بودن در selection
                    .map(markName => {
                        const attrs = editor.getAttributes(markName); // attrs رو بگیر
                        return { name: markName, attrs };
                    });

                // attributes از textStyle
                const attributes = editor.getAttributes('textStyle') || {};

                this.storage.copiedMarks = copiedMarks;
                this.storage.copiedAttributes = attributes;
                return true;
            },
            pasteFormat: () => ({ editor }) => {
                if (!this.storage.copiedMarks.length && !this.storage.copiedAttributes) return false;

                const chain = editor.chain().focus();

                // اول marks رایج رو unset کن برای clean (اختیاری اما مفید)
                chain.unsetBold().unsetItalic().unsetUnderline().unsetHighlight().unsetLink().unsetCode();

                // اعمال attributes textStyle
                if (this.storage.copiedAttributes) {
                    chain.setMark('textStyle', this.storage.copiedAttributes);
                }

                // اعمال marks
                this.storage.copiedMarks.forEach((mark) => {
                    chain.setMark(mark.name, mark.attrs || null);
                });

                chain.run();
                return true;
            },
        };
    },
});