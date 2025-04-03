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
        <NodeViewWrapper className="relative group my-2">
            <pre className="p-3 bg-gray-800 !text-left text-white rounded-md overflow-auto relative">
                <NodeViewContent as="code"/>
           </pre>
            <button onClick={copyToClipboard} className="absolute top-2 right-2 text-xs text-gray-300 cursor-pointer p-1 rounded hover:text-gray-200 hidden group-hover:block">
                <CopyIcon/>
            </button>
        </NodeViewWrapper>
    )
}
