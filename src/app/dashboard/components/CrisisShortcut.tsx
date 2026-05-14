'use client'

import Link from 'next/link'
import { LifeBuoy } from 'lucide-react'

export default function CrisisShortcut() {
  return (
    <div className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6">
      <Link
        href="/dashboard/sos"
        className="inline-flex items-center gap-2 rounded-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 shadow-xl shadow-red-500/35 font-bold text-sm transition-all hover:-translate-y-0.5"
      >
        <LifeBuoy className="w-4 h-4" />
        Crisis Shortcut
      </Link>
    </div>
  )
}
