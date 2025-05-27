'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Problem {
  _id: string
  title: string
  difficulty: string
  tags: string[]
}

interface Bookmark {
  _id: string
  problem: Problem
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      if (!token) {
        setError('No token found. Please log in again.')
        setLoading(false)
        return
      }

      try {
        const res = await axios.get('/api/bookmarks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const problems = res.data
          .filter((b: Bookmark) => b.problem)
          .map((b: Bookmark) => b.problem)

        setBookmarks(problems)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading bookmarks')
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  const removeBookmark = async (problemId: string) => {
    if (removingId) return
    setRemovingId(problemId)

    try {
      await axios.delete(`/api/bookmarks/problem/${problemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setBookmarks((prev) => prev.filter((p) => p._id !== problemId))
    } catch (err: any) {
      console.error('Error removing bookmark:', err.response?.data?.message || err.message)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text text-center">
        🧷 Your Bookmarked Problems
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-zinc-800" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-zinc-400 text-center">You haven’t bookmarked any problems yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((problem) => (
            <div
              key={problem._id}
              className="relative p-4 border border-zinc-700 rounded-lg bg-[#1e293b] hover:bg-[#334155] transition"
            >
              <h3 className="text-lg font-bold text-white">{problem.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">Difficulty: {problem.difficulty}</p>
              <p className="text-sm text-zinc-500 mb-4">Tags: {problem.tags.join(', ')}</p>

              <div className="flex justify-between items-center">
                <Button
                  onClick={() => router.push(`/dashboard/solve/${problem._id}`)}
                  className="text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Solve it
                </Button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeBookmark(problem._id)
                  }}
                  disabled={removingId === problem._id}
                  className="text-white text-xl hover:text-red-400"
                  title="Remove Bookmark"
                >
                  📌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
