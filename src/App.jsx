import './App.css'
import Editor from "./lib/Editor.jsx";

function App() {
  return (
      <div className="tw:flex tw:flex-col tw:p-20 tw:dark:bg-gray-900 tw:h-screen">
        <Editor lang="fa"/>
      </div>
  )
}

export default App
