// editorFunctions.js

// گرفتن انتخاب فعلی کاربر
const getSelectionRange = (editorRef) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) return selection.getRangeAt(0);
    return null;
};

// بازگرداندن انتخاب بعد از عملیات
const restoreSelection = (range, editorRef) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
};

// اعمال استایل با قابلیت toggle (الهام از Tiptap toggleMark)
const applyStyle = (tag, editorRef) => {
    const range = getSelectionRange(editorRef);
    if (!range) return;

    const commonAncestor = range.commonAncestorContainer;
    const parentElement = commonAncestor.nodeType === 1 ? commonAncestor : commonAncestor.parentElement;
    const isAlreadyWrapped = parentElement.closest(tag);

    if (isAlreadyWrapped && range.toString().length > 0) {
        // حذف تگ موجود
        const wrapper = isAlreadyWrapped;
        const parent = wrapper.parentNode;
        while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, wrapper);
        }
        parent.removeChild(wrapper);
        parent.normalize();
    } else {
        // اضافه کردن تگ جدید
        const wrapper = document.createElement(tag);
        try {
            range.surroundContents(wrapper);
        } catch (e) {
            const contents = range.extractContents();
            wrapper.appendChild(contents);
            range.insertNode(wrapper);
        }
    }

    restoreSelection(range, editorRef);
};

// پاک کردن همه استایل‌ها (الهام از Tiptap unsetAllMarks)
const clearStyles = (editorRef) => {
    const range = getSelectionRange(editorRef);
    if (!range) return;

    const fragment = range.extractContents();
    const container = document.createElement("div");
    container.appendChild(fragment);

    // حذف همه تگ‌های استایل‌دهنده و استایل‌های inline
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            return ["STRONG", "EM", "SPAN", "A"].includes(node.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
    });

    const nodesToRemove = [];
    let node;
    while ((node = walker.nextNode())) {
        nodesToRemove.push(node);
    }

    nodesToRemove.forEach((node) => {
        const parent = node.parentNode;
        while (node.firstChild) {
            parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
    });

    const elements = container.querySelectorAll("*");
    elements.forEach((element) => {
        element.removeAttribute("style");
        element.removeAttribute("class");
    });

    range.deleteContents();
    const cleanFragment = document.createDocumentFragment();
    while (container.firstChild) {
        cleanFragment.appendChild(container.firstChild);
    }
    range.insertNode(cleanFragment);
    editorRef.current.normalize();

    restoreSelection(range, editorRef);
};

// تنظیم تراز متن
const setTextAlignSelected = (align, editorRef) => {
    const range = getSelectionRange(editorRef);
    if (!range) return;
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.textAlign = align;
    range.surroundContents(span);
    restoreSelection(range, editorRef);
};

// درج لینک
const addLink = (editorRef) => {
    const url = prompt("آدرس لینک رو وارد کن:");
    if (!url) return;
    const range = getSelectionRange(editorRef);
    if (range) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.className = "text-blue-500 underline";
        range.surroundContents(link);
        restoreSelection(range, editorRef);
    }
};

// درج تصویر
const addImage = (editorRef) => {
    const url = prompt("آدرس تصویر:");
    if (!url) return;
    const range = getSelectionRange(editorRef);
    if (range) {
        const img = document.createElement("img");
        img.src = url;
        img.className = "max-w-full";
        range.insertNode(img);
        restoreSelection(range, editorRef);
    }
};

// درج جدول
const insertTable = (editorRef) => {
    const rows = prompt("تعداد ردیف‌ها:");
    const cols = prompt("تعداد ستون‌ها:");
    if (!rows || !cols) return;
    const range = getSelectionRange(editorRef);
    if (range) {
        const table = document.createElement("table");
        table.className = "border border-gray-300 w-full";
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
                const td = document.createElement("td");
                td.className = "border border-gray-300 p-2";
                td.textContent = "سلول";
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        range.insertNode(table);
        restoreSelection(range, editorRef);
    }
};

// درج ویدیو
const addVideo = (editorRef) => {
    const url = prompt("آدرس ویدیو:");
    if (!url) return;
    const range = getSelectionRange(editorRef);
    if (range) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.className = "max-w-full";
        range.insertNode(video);
        restoreSelection(range, editorRef);
    }
};

// تنظیم فونت
const setFont = (font, editorRef) => {
    const range = getSelectionRange(editorRef);
    if (range) {
        const span = document.createElement("span");
        span.style.fontFamily = font;
        range.surroundContents(span);
        restoreSelection(range, editorRef);
    }
};

// تنظیم سایز فونت
const setFontSize = (size, editorRef) => {
    const range = getSelectionRange(editorRef);
    if (range) {
        const span = document.createElement("span");
        span.style.fontSize = `${size}px`;
        range.surroundContents(span);
        restoreSelection(range, editorRef);
    }
};

// درج لیست ساده
const addBulletList = (editorRef) => {
    const range = getSelectionRange(editorRef);
    if (!range) return;
    const ul = document.createElement("ul");
    ul.className = "list-disc list-inside";
    const li = document.createElement("li");
    li.appendChild(range.extractContents());
    ul.appendChild(li);
    range.insertNode(ul);
    restoreSelection(range, editorRef);
};

// درج لیست عددی
const addNumberedList = (editorRef) => {
    const range = getSelectionRange(editorRef);
    if (!range) return;
    const ol = document.createElement("ol");
    ol.className = "list-decimal list-inside";
    const li = document.createElement("li");
    li.appendChild(range.extractContents());
    ol.appendChild(li);
    range.insertNode(ol);
    restoreSelection(range, editorRef);
};

// درج لیست تیکی
const addCheckList = (editorRef) => {
    const range = getSelectionRange(editorRef);
    if (!range) return;
    const ul = document.createElement("ul");
    ul.className = "list-inside";
    const li = document.createElement("li");
    li.className = "flex items-center gap-2";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);
    li.appendChild(range.extractContents());
    ul.appendChild(li);
    range.insertNode(ul);
    restoreSelection(range, editorRef);
};

export {
    applyStyle,
    clearStyles,
    setTextAlignSelected,
    addLink,
    addImage,
    insertTable,
    addVideo,
    setFont,
    setFontSize,
    addBulletList,
    addNumberedList,
    addCheckList,
};
