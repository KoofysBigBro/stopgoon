'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.error('Dashboard error boundary caught:', error)
  }, [error])

  return (
    <div className="animate-fade-up text-center py-20">
      <span className="text-5xl block mb-4">🛡️</span>
      <h2 className="text-2xl font-bold mb-2">Dashboard error</h2>
      <p className="text-muted mb-6 max-w-md mx-auto">
        Something interrupted your session. Your data is safe.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          Reload
        </button>
        <Link
          href="/dashboard"
          className="bg-surface border border-border hover:border-foreground/30 font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
