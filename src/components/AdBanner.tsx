'use client'

import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdBannerProps {
  isPremium: boolean
  slot?: string           // AdSense ad slot ID
  format?: string         // 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  layout?: string         // 'in-article' | 'in-feed' | etc
  responsive?: boolean
}

export default function AdBanner({ 
  isPremium, 
  slot,
  format = 'auto',
  responsive = true
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID

  // Resolve slot ID:
  // 1. If slot name is numeric, use it directly
  // 2. If slot name is a slug, look for NEXT_PUBLIC_ADSENSE_SLOT_[SLUG_IN_UPPERCASE]
  // 3. Fall back to NEXT_PUBLIC_ADSENSE_SLOT_ID
  let adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID
  if (slot) {
    if (/^\d+$/.test(slot)) {
      adSlot = slot
    } else {
      const envKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, '_')}`
      const envSlot = process.env[envKey]
      if (envSlot && /^\d+$/.test(envSlot)) {
        adSlot = envSlot
      }
    }
  }

  useEffect(() => {
    if (isPremium || !pubId || !adSlot || pushed.current) return

    try {
      // Push the ad after mount
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
        pushed.current = true
      }
    } catch (e) {
      // AdSense not loaded or blocked by adblocker
      console.log('AdSense not available')
    }
  }, [isPremium, pubId, adSlot])

  // Don't render for premium users
  if (isPremium) return null

  // If no AdSense config, show a fallback internal ad
  if (!pubId || !adSlot) {
    return <FallbackAd />
  }

  return (
    <div className="mb-6">
      <div ref={adRef} className="bg-surface border border-border rounded-2xl overflow-hidden min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <Sparkles className="w-3 h-3 text-amber-500" />
        <Link href="/dashboard/upgrade" className="text-xs text-muted hover:text-amber-500 transition-colors">
          Remove ads with Premium
        </Link>
      </div>
    </div>
  )
}

// Fallback ad when AdSense isn't configured yet
function FallbackAd() {
  const ads = [
    { title: 'Go Premium ✨', desc: 'Unlock AI coaching, custom routines, and ad-free browsing.', gradient: 'from-amber-500 to-orange-600', link: '/dashboard/upgrade' },
    { title: 'You\'re Not Alone', desc: 'Join the community and connect with others on the same path.', gradient: 'from-indigo-600 to-purple-600', link: '/dashboard/chat' },
    { title: 'Emergency? SOS', desc: 'Breathing exercises and grounding when urges hit.', gradient: 'from-red-500 to-red-700', link: '/dashboard/sos' },
  ]
  const ad = ads[Math.floor(Math.random() * ads.length)]

  return (
    <div className="mb-6">
      <Link href={ad.link} className={`block bg-gradient-to-r ${ad.gradient} rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Sponsored</p>
        <h3 className="text-white font-bold text-lg mb-1">{ad.title}</h3>
        <p className="text-white/80 text-sm">{ad.desc}</p>
      </Link>
      <div className="flex items-center justify-center gap-2 mt-2">
        <Sparkles className="w-3 h-3 text-amber-500" />
        <Link href="/dashboard/upgrade" className="text-xs text-muted hover:text-amber-500 transition-colors">
          Remove ads with Premium
        </Link>
      </div>
    </div>
  )
}
