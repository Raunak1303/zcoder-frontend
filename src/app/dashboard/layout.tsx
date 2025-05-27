'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, Bookmark, FileText, Users, User, Code, Home, LogOut
} from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/problems', label: 'Problems', icon: BookOpen },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/dashboard/snippets', label: 'Snippets', icon: FileText },
  { href: '/dashboard/rooms', label: 'Rooms', icon: Users },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/editor', label: 'Open Editor', icon: Code },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checkedAuth, setCheckedAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    } else {
      setCheckedAuth(true)
    }
  }, [router])

  if (!checkedAuth) return null // Prevent premature rendering

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 p-6 space-y-6 z-50 overflow-y-auto">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
            ZCoder
          </h2>
        </div>

        <nav className="space-y-2 pt-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
                pathname === link.href
                  ? 'bg-zinc-800 text-indigo-400'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('token')
            router.push('/auth/login')
          }}
          className="mt-10 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8 overflow-y-auto min-h-screen w-full">
        {children}
      </main>
    </div>
  )
}
