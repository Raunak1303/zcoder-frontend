// src/components/layout/dashboard-shell.tsx

import React from 'react'

type DashboardShellProps = {
  children: React.ReactNode
  title?: string
}

export default function DashboardShell({ children, title }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-8">
      {title && (
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
