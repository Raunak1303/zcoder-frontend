'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('https://zcoder-backend-9aq1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid credentials')
      } else {
        if (data.token) {
        localStorage.setItem('token', data.token)
      }
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!hasMounted) return null

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white px-4 py-16">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="whitespace-nowrap text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-400 text-base">
            Login to access ZCoder and start solving.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/70 backdrop-blur-lg border border-zinc-700 rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6"
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text leading-tight mb-6">
            Login
          </h1>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 font-semibold hover:opacity-90 transition duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm text-center text-zinc-400">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/auth/register')}
              className="text-rose-400 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </motion.form>
      </div>
    </main>
  )
}
