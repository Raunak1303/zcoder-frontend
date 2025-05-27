'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select'
import { Loader2, Clipboard, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Dynamically import MonacoEditor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const languageOptions = [
  { id: 71, name: 'Python (3.8.1)', mode: 'python' },
  { id: 54, name: 'C++ (GCC 9.2.0)', mode: 'cpp' },
  { id: 50, name: 'C (GCC 9.2.0)', mode: 'c' },
  { id: 62, name: 'Java (OpenJDK 13)', mode: 'java' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)', mode: 'javascript' },
  { id: 72, name: 'Kotlin (1.3.70)', mode: 'kotlin' },
  { id: 68, name: 'PHP (7.4.1)', mode: 'php' },
  { id: 77, name: 'C# (Mono 6.6.0.161)', mode: 'csharp' },
  { id: 67, name: 'Ruby (2.7.0)', mode: 'ruby' },
  { id: 74, name: 'TypeScript (3.7.4)', mode: 'typescript' },
]

export default function EditorPage() {
  const router = useRouter()
  const [code, setCode] = useState('// Start coding here...')
  const [languageId, setLanguageId] = useState(71)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('https://zcoder-backend-9aq1.onrender.com/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language_id: languageId, stdin: input }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Execution failed')
      } else {
        setOutput(data.output || 'No output')
      }
    } catch (err) {
      toast.error('Execution error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleClear = () => {
    setCode('')
    toast.success('Editor cleared!')
  }

  const handleSaveSnippet = async () => {
    const language = languageOptions.find((l) => l.id === languageId)?.name || 'Unknown'
    const title = prompt('Enter a title for your snippet:')
    const description = prompt('Optional description:')

    if (!title) {
      toast.error('Snippet title is required')
      return
    }

    try {
      const res = await fetch('https://zcoder-backend-9aq1.onrender.com/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          description,
          code,
          language,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Failed to save snippet')
      } else {
        toast.success('Snippet saved!')
        router.push('/dashboard/snippets')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error saving snippet')
    }
  }
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
          ZCoder Playground
        </h1>
      </div>

      {/* Top Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <Select
          onValueChange={(val) => setLanguageId(Number(val))}
          defaultValue={languageId.toString()}
        >
          <SelectTrigger className="w-[240px] bg-[#1e293b] text-white border border-zinc-600">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e293b] text-white">
            {languageOptions.map((lang) => (
              <SelectItem key={lang.id} value={lang.id.toString()}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleRun}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90"
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Run Code
          </Button>
          <Button
            onClick={() => handleCopy(code)}
            className="bg-[#1e293b] text-white hover:bg-[#334155] border border-zinc-600"
          >
            <Clipboard className="mr-1 h-4 w-4" /> Copy
          </Button>
          <Button
            onClick={handleClear}
            className="bg-[#1e293b] text-white hover:bg-[#334155] border border-zinc-600"
          >
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
          <Button
            onClick={handleSaveSnippet}
            className="bg-[#1e293b] text-white hover:bg-[#334155] border border-zinc-600"
          >
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        {/* Code Editor */}
        <div className="border border-zinc-700 rounded-xl overflow-hidden">
          <MonacoEditor
            height="600px"
            language={
              languageOptions.find((l) => l.id === languageId)?.mode || 'javascript'
            }
            theme="vs-dark"
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
            onChange={(newCode) => setCode(newCode || '')}
          />
        </div>

        {/* Input/Output */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-zinc-400">Input (stdin)</label>
            <Textarea
              placeholder="Enter input..."
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-1 bg-black text-white border border-zinc-600"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Output</label>
            <Textarea
              value={output}
              readOnly
              rows={10}
              className="mt-1 text-green-400 bg-black border border-zinc-600"
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
      </div>
    </div>
  )
}
