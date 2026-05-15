import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-8xl font-heading font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-3">Page not found</h1>
        <p className="text-muted mb-8 leading-relaxed">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
