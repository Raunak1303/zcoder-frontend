'use client'

import Editor from '@monaco-editor/react'

const CodeEditor = ({ code, setCode, languageId }: any) => {
  const languageMap: Record<number, string> = {
    54: 'cpp',
    62: 'java',
    71: 'python',
    63: 'javascript',
  }

  return (
    <div className="w-full border border-zinc-600 rounded overflow-hidden">
      <Editor
        height="400px"
        theme="vs-dark"
        defaultLanguage={languageMap[languageId]}
        defaultValue={code}
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{ fontSize: 14 }}
      />
    </div>
  )
}

export default CodeEditor
