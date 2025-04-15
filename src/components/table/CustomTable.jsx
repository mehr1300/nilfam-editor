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
                default: 'tw:w-fit tw:border-collapse tw:table-auto tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded-lg tw:overflow-hidden tw:shadow-md tw:mx-auto',
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
            class: 'tw:even:bg-gray-50 tw:hover:bg-gray-100',
        }, HTMLAttributes), 0];
    },
});

export const CustomTableHeader = TableHeader.extend({
    renderHTML({ HTMLAttributes }) {
        return ['th', mergeAttributes({
            class: 'tw:bg-gray-200 tw:dark:bg-gray-800 tw:text-gray-700 tw:font-semibold tw:py-2 tw:px-4 tw:border-b tw:border-r tw:border-gray-300 tw:dark:border-gray-700 tw:text-right',
        }, HTMLAttributes), 0];
    },
});

export const CustomTableCell = TableCell.extend({
    renderHTML({ HTMLAttributes }) {
        return ['td', mergeAttributes({
            class: 'tw:py-2 tw:px-4 tw:border-b tw:border-r tw:border-gray-300 tw:dark:border-gray-700 tw:text-right',
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
                    class: 'tw:w-fit tw:border-collapse tw:table-auto tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded-lg tw:overflow-hidden tw:shadow-md tw:ml-auto'
                })
                .run();
        }
        setIsModalOpen(false)
    };

    return (
        <div className="tw:relative">
            <button className="class-button" onClick={()=>{setIsModalOpen(true)}} title={t('insertTable', lang)}>
                <TableIcon />
            </button>

            {isModalOpen && (
                <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/10 tw:backdrop-blur-xs tw:z-50">
                    <div className="tw:flex tw:flex-col tw:relative tw:bg-white tw:dark:bg-gray-600  tw:gap-3 tw:p-6 tw:rounded-lg tw:shadow-lg tw:w-96">
                        <div className="tw:flex tw:flex-row tw:justify-between tw:items-center tw:mb-1">
                        <span className="tw:font-bold"> {t('addTable', lang)}</span>
                            <button onClick={() => {setIsModalOpen(false);}} className="cursor-pointer text-gray-700 hover:text-gray-500" aria-label={t('close', lang)}>
                                <XIcon/>
                            </button>
                        </div>
                        <div className="tw:flex tw:flex-col tw:gap-2">
                            <div className="tw:flex tw:flex-col tw:gap-1">
                                <label htmlFor="cols">{t('row', lang)}</label>
                                <input value={rows} onChange={(e) => setRows(e.target.value)} type="text" className="tw:p-1.5 tw:text-gray-800 tw:dark:text-gray-300 tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:px-1"/>
                            </div>
                            <div className="tw:flex tw:flex-col tw:gap-1">
                                <label htmlFor="cols">{t('col', lang)}</label>
                                <input id="cols" value={cols} onChange={(e) => setCols(e.target.value)} type="text" className="tw:p-1.5 tw:text-gray-800 tw:dark:text-gray-300 tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded tw:px-1"/>
                            </div>
                        </div>
                        <button className=" tw:w-full tw:p-2 tw:bg-gray-300 tw:dark:bg-gray-500 tw:rounded tw:hover:bg-gray-400 tw:cursor-pointer" onClick={() => insertTable()}>
                            {t('add', lang)}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomTable;
