import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { mergeAttributes } from '@tiptap/core';
import {useEffect, useState} from 'react';
import {TableIcon, XIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";
import {Configs} from "../config/Configs.js";

export const CustomTable = Table.extend({
    addAttributes() {
        return {
            class: {
                default: 'w-fit border-collapse table-auto border border-gray-300 rounded-lg overflow-hidden shadow-md mx-auto',
                renderHTML: attributes => ({
                    class: attributes.class, // کلاس‌ها رو به HTML منتقل می‌کنه
                }),
            },
        };
    },
    renderHTML({ HTMLAttributes }) {
        return ['table', mergeAttributes({ dir: 'rtl' }, HTMLAttributes), 0];
    },
});

export const CustomTableRow = TableRow.extend({
    renderHTML({ HTMLAttributes }) {
        return ['tr', mergeAttributes({
            class: 'even:bg-gray-50 hover:bg-gray-100',
        }, HTMLAttributes), 0];
    },
});

export const CustomTableHeader = TableHeader.extend({
    renderHTML({ HTMLAttributes }) {
        return ['th', mergeAttributes({
            class: 'bg-gray-200 text-gray-700 font-semibold py-2 px-4 border-b border-r border-gray-300 text-right',
        }, HTMLAttributes), 0];
    },
});

export const CustomTableCell = TableCell.extend({
    renderHTML({ HTMLAttributes }) {
        return ['td', mergeAttributes({
            class: 'py-2 px-4 border-b border-r border-gray-300 text-right',
        }, HTMLAttributes), 0];
    },
});

export const InsertTableButton = ({ editor, setIsTableSelected, isTableSelected,lang}) => {

    useEffect(() => {
        const updateToolbarPosition = () => {
            const isSelected = editor.isActive('table');
            setIsTableSelected(isSelected);
        };

        editor.on('selectionUpdate', updateToolbarPosition);
        editor.on('transaction', updateToolbarPosition);

        const handleScrollResize = () => {
            if (isTableSelected) updateToolbarPosition();
        };
        window.addEventListener('scroll', handleScrollResize);
        window.addEventListener('resize', handleScrollResize);

        return () => {
            editor.off('selectionUpdate', updateToolbarPosition);
            editor.off('transaction', updateToolbarPosition);
            window.removeEventListener('scroll', handleScrollResize);
            window.removeEventListener('resize', handleScrollResize);
        };
    }, [editor, isTableSelected]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rows ,setRows] = useState(2)
    const [cols ,setCols] = useState(2)
    const insertTable = () => {
        if (rows && cols) {
            editor
                .chain()
                .focus()
                .insertTable({ rows: parseInt(rows), cols: parseInt(cols), withHeaderRow: true })
                .setNode('table', {
                    class: 'w-fit border-collapse table-auto border border-gray-300 rounded-lg overflow-hidden shadow-md ml-auto'
                })
                .run();
        }
        setIsModalOpen(false)
    };

    return (
        <div className="relative">
            <button className="class-button" onClick={()=>{setIsModalOpen(true)}} title={t('insertTable', lang)}>
                <TableIcon />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs z-50">
                    <div className="flex flex-col relative bg-white gap-3 p-6 rounded-lg shadow-lg w-96">
                        <div className="flex flex-row justify-between items-center mb-1">
                        <span className="font-bold"> {t('addTable', lang)}</span>
                            <button onClick={() => {setIsModalOpen(false);}} className="cursor-pointer text-gray-700 hover:text-gray-500" aria-label={t('close', lang)}>
                                <XIcon/>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="cols">{t('row', lang)}</label>
                                <input value={rows} onChange={(e) => setRows(e.target.value)} type="text" className="p-1.5 text-gray-800 border border-gray-300 rounded px-1"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="cols">{t('col', lang)}</label>
                                <input id="cols" value={cols} onChange={(e) => setCols(e.target.value)} type="text" className="p-1.5 text-gray-800 border border-gray-300 rounded px-1"/>
                            </div>
                        </div>
                        <button className=" w-full p-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer" onClick={() => insertTable()}>
                            {t('add', lang)}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomTable;
