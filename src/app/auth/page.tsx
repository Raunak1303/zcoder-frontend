'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AuthPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white px-4 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-16 md:p-16 rounded-3xl shadow-2xl bg-zinc-900/70 backdrop-blur-lg border border-zinc-700 max-w-lg w-full"
      >
        {/* Heading with gradient text like Home page */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-rose-500 to-indigo-400 text-transparent bg-clip-text mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to ZCoder
        </motion.h1>

        {/* Subheading larger and with lighter color */}
        <motion.p
          className="text-lg md:text-xl text-zinc-300 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Login or Register to get started
        </motion.p>

        {/* Buttons */}
        <div className="flex gap-8 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center px-8 py-4 text-xl font-medium text-white border border-white rounded-xl overflow-hidden group"
            onClick={() => router.push('/auth/login')}
          >
            <span className="absolute w-full h-0 transition-all duration-300 ease-out bg-white top-0 left-0 group-hover:h-full opacity-10"></span>
            Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center px-8 py-4 text-xl font-medium text-white border border-white rounded-xl overflow-hidden group"
            onClick={() => router.push('/auth/register')}
          >
            <span className="absolute w-full h-0 transition-all duration-300 ease-out bg-white top-0 left-0 group-hover:h-full opacity-10"></span>
            Register
          </motion.button>
        </div>
      </motion.div>
    </main>
  )
}
