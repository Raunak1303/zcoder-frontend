'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams } from 'next/navigation'
import { Problem } from '@/types/problem'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false })

const SolvePage = () => {
  const { id } = useParams()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [languageId, setLanguageId] = useState(54) // C++ default
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/api/problem/${id}`)
        setProblem(res.data)
      } catch (err) {
        console.error('Error loading problem:', err)
      }
    }

    if (id) fetchProblem()
  }, [id])

  const handleSubmit = async () => {
    setLoading(true)
    setStatus('')
    setOutput('')

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    try {
      const res = await axios.post(
        '/api/codeexecution/submit',
        {
          code,
          languageId,
          problemId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setOutput(res.data.stdout || res.data.stderr || res.data.compile_output || '')
      setStatus(
        res.data.passed
          ? '✅ You solved it successfully!'
          : `❌ Wrong Answer. Expected: ${problem?.expectedOutput}`
      )
    } catch (err) {
      console.error('Execution failed:', err)
      setStatus('❌ Execution failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!problem) return <div className="text-white p-8">Loading...</div>

  return (
    <div className="min-h-screen p-6 text-white bg-[#0f172a]">
      <h2 className="text-3xl font-bold mb-4 text-indigo-400">{problem.title}</h2>
      <p className="mb-4 text-zinc-300">{problem.description}</p>

      {/* Show input test case */}
      <div className="mb-4 text-sm text-zinc-400">
        <strong>Input Test Case:</strong>
        <pre className="bg-[#1e293b] p-2 mt-1 rounded border border-zinc-700 text-white">
          {problem.inputTestCase}
        </pre>
      </div>

      <CodeEditor languageId={languageId} code={code} setCode={setCode} />

      <div className="mt-4 flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90"
        >
          {loading ? 'Running...' : 'Run & Submit'}
        </Button>
        <select
          value={languageId}
          onChange={(e) => setLanguageId(Number(e.target.value))}
          className="bg-[#1e293b] text-white border border-zinc-600 px-2 py-1 rounded"
        >
          <option value={54}>C++</option>
          <option value={62}>Java</option>
          <option value={71}>Python</option>
          <option value={63}>JavaScript</option>
          <option value={50}>C</option>
          <option value={77}>C sharp</option>
          <option value={72}>Kotlin</option>
        </select>
      </div>

      {status && <p className="mt-4 font-semibold">{status}</p>}
      {output && (
        <div className="mt-2 p-4 border border-zinc-600 rounded bg-[#1e293b]">
          <pre>{output}</pre>
        </div>
      )}
    </div>
  )
}

export default SolvePage
