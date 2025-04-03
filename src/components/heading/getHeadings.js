// utils/getHeadings.js

export function getHeadings(editor) {
    const headings = []
    // اگر ادیتور یا state وجود نداشت، خالی برگرد
    if (!editor?.state?.doc) return headings

    editor.state.doc.descendants((node) => {
        if (node.type.name === 'heading') {
            headings.push({
                level: node.attrs.level,
                id: node.attrs.id,
                text: node.textContent,
            })
        }
    })

    return headings
}
