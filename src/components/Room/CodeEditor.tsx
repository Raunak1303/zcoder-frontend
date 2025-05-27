'use client'

import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Play, Clipboard } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { toast } from 'sonner'

interface CodeEditorProps {
  code: string
  onCodeChange: (value: string) => void
  languageId: number
  setLanguageId: (id: number) => void
  stdin: string
  setStdin: (val: string) => void
  output: string
  onRunCode: () => void
}

const languages = [
  { id: 71, label: 'Python' },
  { id: 63, label: 'JavaScript' },
  { id: 62, label: 'Java' },
  { id: 54, label: 'C++' },
  { id: 50, label: 'C' },
]

const CodeEditor: FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  languageId,
  setLanguageId,
  stdin,
  setStdin,
  output,
  onRunCode,
}) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-xl shadow-lg space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
          Code Editor
        </h2>
        <Select
          value={languageId.toString()}
          onValueChange={(val) => setLanguageId(Number(val))}
        >
          <SelectTrigger className="w-[200px] bg-[#1e293b] text-white border border-zinc-600">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e293b] text-white">
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id.toString()}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Code Editor */}
      <div className="border border-zinc-700 rounded-xl overflow-hidden">
        <Editor
          height="400px"
          theme="vs-dark"
          language={
            languages.find((l) => l.id === languageId)?.label.toLowerCase() || 'python'
          }
          value={code}
          onChange={(val) => onCodeChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-zinc-400">Input (stdin)</label>
          <Textarea
            placeholder="Enter input..."
            rows={6}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="mt-1 bg-black text-white border border-zinc-600"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">Output</label>
          <Textarea
            readOnly
            rows={6}
            value={output}
            className="mt-1 bg-black text-green-400 border border-zinc-600"
          />
          <Button
            size="sm"
            className="mt-2 bg-[#1e293b] text-white hover:bg-[#334155] border border-zinc-600"
            onClick={() => handleCopy(output)}
          >
            <Clipboard className="mr-1 h-4 w-4" /> Copy Output
          </Button>
        </div>
      </div>

      {/* Run Button */}
      <div className="flex justify-end">
        <Button
          onClick={onRunCode}
          className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Code
        </Button>
      </div>
    </div>
  )
}

export default CodeEditor
