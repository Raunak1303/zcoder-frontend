'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams } from 'next/navigation'
import { Problem } from '@/types/problem'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Comment {
  _id: string
  text: string
  user: {
    username: string
  }
  createdAt: string
}

const CommentPage = () => {
  const { id } = useParams()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/api/problem/${id}`)
        setProblem(res.data)
      } catch (err) {
        console.error('Error loading problem:', err)
        setError('Failed to load problem')
      }
    }

    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comment/${id}`)
        setComments(res.data)
      } catch (err) {
        console.error('Error loading comments:', err)
        setError('Failed to load comments')
      }
    }

    if (id) {
      fetchProblem()
      fetchComments()
    }
  }, [id])

  const handlePostComment = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      alert('Please log in to comment.')
      return
    }

    if (!text.trim()) return

    setLoading(true)
    try {
      const res = await axios.post(
        `/api/comment/${id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setComments([res.data, ...comments])
      setText('')
    } catch (err) {
      console.error('Error posting comment:', err)
      setError('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  if (error) return <div className="text-red-400 p-6">{error}</div>
  if (!problem) return <div className="text-white p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6 text-white bg-[#0f172a]">
      <h2 className="text-3xl font-bold mb-4 text-indigo-400">{problem.title}</h2>
      <p className="mb-6 text-zinc-300">{problem.description}</p>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-rose-400">Post a Comment</h3>
        <Textarea
          placeholder="Share your thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-2 bg-[#1e293b] text-white border border-zinc-600"
        />
        <Button onClick={handlePostComment} disabled={loading} className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90">
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 text-rose-400">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-zinc-400">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="mb-4 p-4 border border-zinc-700 rounded bg-[#1e293b]"
            >
              <p className="text-zinc-200">{comment.text}</p>
              <p className="text-sm text-zinc-500 mt-1">
                — {comment.user?.username || 'Anonymous'} | {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentPage
