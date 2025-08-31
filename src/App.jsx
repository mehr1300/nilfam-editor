import './App.css'
import Editor from "./lib/Editor.jsx";
import {useState} from "react";

function App() {

    const [content, setContent] = useState('<p>Start editing...</p>');

    // useEffect(() => {
    //     console.log(content);
    // }, [content]);

    return (
        <div className="tw:flex tw:flex-col tw:p-20 tw:dark:bg-gray-900 tw:h-screen">
            <Editor  value={content} onChange={setContent} lang="fa"
                     isDark={false}/>
        </div>


)
}

export default App
