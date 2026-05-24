'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'stopgoon-cookie-consent'

function idleCallback(fn: () => void) {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(fn, { timeout: 3000 })
    return () => cancelIdleCallback(id)
  }
  const id = setTimeout(fn, 3000)
  return () => clearTimeout(id)
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return idleCallback(() => setVisible(true))
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
      role="region"
      aria-label="Cookie notice"
      style={{ contentVisibility: 'auto', contain: 'layout style paint' }}
      className="fixed bottom-0 inset-x-0 p-4 sm:p-6 pointer-events-none"
    >
      <div className="mx-auto max-w-3xl bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-2xl pointer-events-auto">
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
