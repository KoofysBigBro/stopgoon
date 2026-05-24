'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
  loading: () => null,
})

export default function CookieConsentWrapper() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 2000)
    return () => clearTimeout(id)
  }, [])

  if (!ready) return null

  return <CookieConsent />
}
