'use client'

export function trackGAEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', name, params)
  }
}
