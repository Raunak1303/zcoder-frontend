'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Bookmark, FileText, Users, Code, User } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  const features = [
    { title: 'Problems', icon: BookOpen, path: '/dashboard/problems', description: 'Solve coding problems and test your skills.' },
    { title: 'Bookmarks', icon: Bookmark, path: '/dashboard/bookmarks', description: 'Quick access to your saved problems.' },
    { title: 'Snippets', icon: FileText, path: '/dashboard/snippets', description: 'Store and manage your favorite code snippets.' },
    { title: 'Rooms', icon: Users, path: '/dashboard/rooms', description: 'Join coding rooms and collaborate in real-time.' },
    { title: 'Profile', icon: User, path: '/dashboard/profile', description: 'View and edit your personal ZCoder profile.' },
    { title: 'Do Coding Practice', icon: Code, path: '/dashboard/editor', description: 'Practice coding with our live editor anytime.' },
  ]

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 4px #6366f1, 0 0 8px #ec4899; }
            50% { box-shadow: 0 0 8px #6366f1, 0 0 16px #ec4899; }
            100% { box-shadow: 0 0 4px #6366f1, 0 0 8px #ec4899; }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text"
        >
          Welcome to Your Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-center text-zinc-400 text-lg"
        >
          Navigate through powerful tools and enhance your coding journey with ZCoder.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => router.push(feature.path)}
              className="cursor-pointer group h-56 bg-zinc-900 border-2 border-transparent rounded-2xl p-6 flex flex-col justify-center transition-all duration-300 hover:animate-glow"
              style={{
                animation: 'glow 2s infinite alternate',
                borderImage: 'linear-gradient(to right, #6366f1, #ec4899) 1',
              }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <feature.icon className="w-10 h-10 text-indigo-400 group-hover:text-rose-400 transition" />
                <h2 className="text-2xl font-bold">{feature.title}</h2>
              </div>
              <p className="text-zinc-400 text-base group-hover:text-zinc-300 transition">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
