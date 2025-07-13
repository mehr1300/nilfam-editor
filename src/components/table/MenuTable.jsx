import {t} from "../Lang/i18n.js";
import {AddColumnAfterIcon, AddRowAfterIcon, AlignTableCenterIcon, AlignTableLeftIcon, AlignTableRightIcon, RemoveColumnIcon, RemoveRowIcon, TrashIcon} from "../../assets/icons/Icons.jsx";

const MenuTable = ({ editor, isTableSelected, lang }) => {
    const addRowAfter = () => {
        editor.chain().focus().addRowAfter().run();
    };

    const addColumnAfter = () => {
        editor.chain().focus().addColumnAfter().run();
    };

    const deleteRow = () => {
        editor.chain().focus().deleteRow().run();
    };

    const deleteColumn = () => {
        editor.chain().focus().deleteColumn().run();
    };

    const alignTableLeft = () => {
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', {
                class: 'tw:w-fit tw:border-collapse tw:table-auto tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded-lg tw:overflow-hidden tw:shadow-md tw:mr-auto'
            }).run();
        }
    };

    const alignTableCenter = () => {
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', {
                class: 'tw:w-fit tw:border-collapse tw:table-auto tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded-lg tw:overflow-hidden tw:shadow-md tw:mx-auto'
            }).run();
        }
    };

    const alignTableRight = () => {
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', {
                class: 'tw:w-fit tw:border-collapse tw:table-auto tw:border tw:border-gray-300 tw:dark:border-gray-700 tw:rounded-lg tw:overflow-hidden tw:shadow-md tw:ml-auto'
            }).run();
        }
    };

    const deleteTable = () => {
        editor.chain().focus().deleteTable().run();
    };

    return (
        <div className="tw:flex tw:flex-row">
            {isTableSelected && (
                <div className="tw:flex tw:flex-row tw:bg-red-100 tw:rounded">
                    <div className="class-button" onClick={addRowAfter} title={t('addRowAfter', lang)}>
                        <AddRowAfterIcon />
                    </div>
                    <div className="class-button" onClick={addColumnAfter} title={t('addColumnAfter', lang)}>
                        <AddColumnAfterIcon/>
                    </div>
                    <div className="class-button" onClick={deleteRow} title={t('deleteRow', lang)}>
                        <RemoveColumnIcon/>
                    </div>
                    <div className="class-button" onClick={deleteColumn} title={t('deleteColumn', lang)}>
                        <RemoveRowIcon/>
                    </div>
                    <div className="class-button" onClick={alignTableRight} title={t('alignTableRight', lang)}>
                        <AlignTableRightIcon />
                    </div>
                    <div className="class-button" onClick={alignTableCenter} title={t('alignTableCenter', lang)}>
                        <AlignTableCenterIcon />
                    </div>
                    <div className="class-button" onClick={alignTableLeft} title={t('alignTableLeft', lang)}>
                        <AlignTableLeftIcon />
                    </div>
                    <div className="class-button" onClick={deleteTable} title={t('deleteTable', lang)}>
                        <TrashIcon />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuTable;
