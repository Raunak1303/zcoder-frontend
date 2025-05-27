'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Types
type Problem = {
  _id: string
  title: string
  description: string
  difficulty: string
  tags: string[]
}

const ProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [difficulty, setDifficulty] = useState('all')
  const [tag, setTag] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [bookmarks, setBookmarks] = useState<string[]>([])

  const router = useRouter()

  const fetchProblems = async () => {
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 5,
      }
      if (difficulty !== 'all') params.difficulty = difficulty
      if (tag.trim()) params.tag = tag.trim()

      const res = await axios.get('/api/problem', { params })
      setProblems(res.data.problems)
      setTotalPages(res.data.totalPages)
    } catch (err: any) {
      console.error('Error fetching problems:', err?.message || err)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('/api/bookmarks')
      const ids = res.data
        .filter((b: any) => b.problem)
        .map((b: any) => b.problem._id)
      setBookmarks(ids)
    } catch (err) {
      console.error('Error fetching bookmarks:', err)
    }
  }

  const toggleBookmark = async (problemId: string) => {
    try {
      const isBookmarked = bookmarks.includes(problemId)

      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/problem/${problemId}`)
        setBookmarks((prev) => prev.filter((id) => id !== problemId))
      } else {
        await axios.post(`/api/bookmarks/problem/${problemId}`)
        setBookmarks((prev) => [...prev, problemId])
      }
    } catch (err: any) {
      console.error('Bookmark toggle error:', err?.response?.data?.message || err.message)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchProblems()
      fetchBookmarks()
    }
  }, [difficulty, tag, currentPage, mounted])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
        Practice Problems (to bookmark problems click{' '}
        <span className="inline-block text-[initial]">⭐</span>)
      </h2>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* Difficulty Filter */}
        <Select
          onValueChange={(val) => {
            setDifficulty(val)
            setCurrentPage(1)
          }}
          defaultValue="all"
        >
          <SelectTrigger className="w-[200px] bg-[#1e293b] text-white border border-zinc-600">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e293b] text-white">
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Input
          placeholder="Search by tag..."
          value={tag}
          onChange={(e) => {
            setTag(e.target.value)
            setCurrentPage(1)
          }}
          className="w-[240px] bg-[#1e293b] text-white border border-zinc-600 placeholder:text-zinc-400"
        />
      </div>

      <div className="space-y-4">
        {Array.isArray(problems) &&
          problems.map((p) => {
            const isBookmarked = bookmarks.includes(p._id)

            return (
              <div
                key={p._id}
                className="relative p-4 border border-zinc-700 rounded-lg bg-[#1e293b] hover:bg-[#334155] transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white hover:underline">
                    <Link href={`/dashboard/solve/${p._id}`}>{p.title}</Link>
                  </h3>

                  {/* Comments Button */}
                  <button
                    className="text-sm px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-white mr-5"
                    onClick={() => router.push(`/dashboard/comments/${p._id}`)}
                  >
                    Comments
                  </button>
                </div>

                <p className="text-sm text-zinc-400 mt-1">Difficulty: {p.difficulty}</p>
                <p className="text-sm text-zinc-500">Tags: {p.tags.join(', ')}</p>

                {/* Bookmark Icon */}
                <button
                  onClick={() => toggleBookmark(p._id)}
                  className="absolute top-2 right-2 text-white text-xl"
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this problem'}
                >
                  {isBookmarked ? '📌' : '⭐'}
                </button>

                {/* Solve It Button at bottom-right */}
                <div className="absolute bottom-2 right-2">
                  <Link href={`/dashboard/solve/${p._id}`}>
                    <button className="px-4 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded text-white">
                      Solve It
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}

        {problems.length === 0 && (
          <p className="text-center text-zinc-400 mt-10">No problems found.</p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <Button
          variant="outline"
          className="bg-[#1e293b] text-white border border-zinc-600"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-white self-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          className="bg-[#1e293b] text-white border border-zinc-600"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default ProblemsPage
