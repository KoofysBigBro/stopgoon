'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <span className="text-6xl block mb-6">😅</span>
        <h1 className="text-3xl font-bold font-heading mb-3">Something went wrong</h1>
        <p className="text-muted mb-8">
          Don't worry — this happens sometimes. Let's try again.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-surface border border-border hover:border-foreground/30 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
