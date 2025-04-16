import React from 'react'
import {NodeViewWrapper, NodeViewContent} from '@tiptap/react'
import {CopyIcon} from "../../assets/icons/Icons.jsx";

export default function CodeBlockComponent({node}) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(node.textContent || '')
            .then(() => {
                console.log('Copied!')
            })
            .catch(err => console.error('Failed to copy: ', err))
    }

    return (
        <NodeViewWrapper className="tw:relative tw:group tw:my-2">
            <pre className="tw:p-3 tw:bg-gray-800 tw:!text-left tw:text-white tw:rounded-md tw:overflow-auto tw:relative">
                <NodeViewContent as="code"/>
           </pre>
            <div onClick={copyToClipboard} className="tw:absolute tw:top-2 tw:right-2 tw:text-xs tw:text-gray-300 tw:cursor-pointer tw:p-1 tw:rounded tw:hover:text-gray-200 tw:hidden tw:group-hover:block">
                <CopyIcon/>
            </div>
        </NodeViewWrapper>
    )
}
