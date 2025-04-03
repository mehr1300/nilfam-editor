import {t} from "../Lang/i18n.js";
import {AddColumnAfter, AddRowAfterIcon, AlignTableCenterIcon, AlignTableLeftIcon, AlignTableRightIcon, TrashIcon} from "../../assets/icons/Icons.jsx";

const MenuTable = ({editor,isTableSelected,lang}) => {
    const addRowAfter = () => {
        editor.chain().focus().addRowAfter().run();
    };

    const addColumnAfter = () => {
        editor.chain().focus().addColumnAfter().run();
    };

    const alignTableLeft = () => {
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', {
                class: 'w-fit border-collapse table-auto border border-gray-300 rounded-lg overflow-hidden shadow-md mr-auto'
            }).run();
            console.log('Updated table classes:', editor.getAttributes('table').class);
            const tableNode = editor.view.dom.querySelector('table');
            console.log('DOM table classes:', tableNode ? tableNode.className : 'No table in DOM');
        }
    };

    const alignTableCenter = () => {
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', {
                class: 'w-fit border-collapse table-auto border border-gray-300 rounded-lg overflow-hidden shadow-md mx-auto'
            }).run();
            console.log('Updated table classes:', editor.getAttributes('table').class);
            const tableNode = editor.view.dom.querySelector('table');
            console.log('DOM table classes:', tableNode ? tableNode.className : 'No table in DOM');
        }
    };

    const alignTableRight = () => {
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', {
                class: 'w-fit border-collapse table-auto border border-gray-300 rounded-lg overflow-hidden shadow-md ml-auto'
            }).run();
            console.log('Updated table classes:', editor.getAttributes('table').class);
            const tableNode = editor.view.dom.querySelector('table');
            console.log('DOM table classes:', tableNode ? tableNode.className : 'No table in DOM');
        }
    };

    const deleteTable = () => {
        editor.chain().focus().deleteTable().run();
    };
    return (
        <div className="flex flex-row ">
            {isTableSelected && (
                <div className="flex flex-row bg-red-100 rounded">
                    <button className="class-button" onClick={addRowAfter} title={t('addRowAfter', lang)}>
                        <AddRowAfterIcon/>
                    </button>
                    <button className="class-button" onClick={addColumnAfter} title={t('addColumnAfter', lang)}>
                        <AddColumnAfter/>
                    </button>
                    <button className="class-button" onClick={alignTableRight} title={t('alignTableRight', lang)}>
                        <AlignTableRightIcon/>
                    </button>

                    <button className="class-button" onClick={alignTableCenter} title={t('alignTableCenter', lang)}>
                        <AlignTableCenterIcon/>
                    </button>

                    <button className="class-button" onClick={alignTableLeft} title={t('alignTableLeft', lang)}>
                        <AlignTableLeftIcon/>
                    </button>

                    <button className="class-button" onClick={deleteTable} title={t('delete', lang)}>
                        <TrashIcon/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuTable;
