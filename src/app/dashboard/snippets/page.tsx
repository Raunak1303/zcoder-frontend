'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface Snippet {
  _id: string
  title: string
  description?: string
  language: string
  code: string
  createdAt: string
}

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const fetchSnippets = async () => {
    try {
      const res = await fetch('https://zcoder-backend-9aq1.onrender.com/api/snippets', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch')
      setSnippets(data)
    } catch (err) {
      toast.error('Could not load snippets')
    }
  }

  useEffect(() => {
    fetchSnippets()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this snippet?')
    if (!confirmDelete) return

    try {
      setLoadingId(id)
      const res = await fetch(`https://zcoder-backend-9aq1.onrender.com/api/snippets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')
      toast.success('Snippet deleted')
      setSnippets((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      toast.error('Failed to delete snippet')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">Saved Snippets</h1>
      {snippets.length === 0 ? (
        <p className="text-gray-400">No snippets saved yet.</p>
      ) : (
        <div className="space-y-4">
          {snippets.map((snippet) => (
            <div
              key={snippet._id}
              className="p-4 rounded-lg bg-[#1e293b] border border-gray-600 relative"
            >
              {/* Delete Button */}
              <Button
                variant="outline"
                className="absolute top-4 right-4 bg-[#1e293b] text-white hover:bg-[#334155] border border-zinc-600"
                size="default"
                onClick={() => handleDelete(snippet._id)}
                disabled={loadingId === snippet._id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {/* Snippet Info */}
              <h2 className="text-xl font-semibold">{snippet.title}</h2>
              <p className="text-sm text-gray-400">{snippet.language}</p>
              {snippet.description && (
                <p className="text-sm mt-1 text-gray-300">{snippet.description}</p>
              )}
              <pre className="mt-2 text-sm overflow-x-auto whitespace-pre-wrap">
                {snippet.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
