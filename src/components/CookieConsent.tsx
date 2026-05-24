'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'stopgoon-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }, [])

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'dismissed')
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-foreground leading-relaxed flex-1">
            We use cookies to analyze traffic and improve your experience.{' '}
            <a href="/privacy" className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              Learn more
            </a>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={dismiss}
              className="px-4 py-2.5 text-sm font-semibold text-muted hover:text-foreground border border-border rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
