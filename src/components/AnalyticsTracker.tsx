'use client'

import { useEffect } from 'react'
import { trackGAEvent } from '@/utils/analytics'

export default function AnalyticsTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest<HTMLAnchorElement>('a[href*="/dashboard/upgrade"], a[href="/pricing"]')
      if (link) {
        trackGAEvent('upgrade_clicked', { location: link.getAttribute('href') || 'unknown' })
      }
    }

    document.addEventListener('click', handleClick, { capture: true, passive: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return null
}
