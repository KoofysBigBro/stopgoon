'use client'

import { useEffect } from 'react'

export default function PWAInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {})
        .catch(() => {})
    }

    // Capture the install prompt globally
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault()
      // @ts-ignore
      window.deferredInstallPrompt = e
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    }
  }, [])

  return null
}
