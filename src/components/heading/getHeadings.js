// utils/getHeadings.ts
export function getHeadings(editor) {
    const result = []
    if (!editor?.state?.doc) return result

    editor.state.doc.descendants(node => {
        if (
            node.type.name === 'heading' &&
            node.textContent.trim()         // متن خالی نباشد
        ) {
            result.push({
                level: node.attrs.level,
                id   : node.attrs.id || '',   // اگر آیدی هنوز نساخته
                text : node.textContent,
            })
        }
    })
    return result
}
