'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading')
  const [inView, setInView] = useState(false)

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

  // Intersection Observer to detect when the ad is close to entering the viewport
  useEffect(() => {
    if (isPremium || !pubId || !adSlot) return

    const el = adRef.current
    if (!el) return

    // Fall back to immediate loading if IntersectionObserver is not supported by browser
    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px', // Preload ad 200px before scrolling it into view
      }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [isPremium, pubId, adSlot])

  // Viewport-aware script injection and ad slot push
  useEffect(() => {
    if (isPremium || !pubId || !adSlot || !inView) return

    // Dynamically inject Google AdSense script only on-demand
    if (typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
    }

    // Set a timeout to fall back to internal ads if AdSense is blocked by an adblocker or fails to load
    const timeoutId = setTimeout(() => {
      setAdStatus((prev) => (prev === 'loading' ? 'unfilled' : prev))
    }, 2500)

    try {
      if (typeof window !== 'undefined') {
        if (!pushed.current) {
          window.adsbygoogle = window.adsbygoogle || []
          window.adsbygoogle.push({})
          pushed.current = true
        }

        // Set up MutationObserver to detect Google AdSense unfilled status
        const insElement = adRef.current?.querySelector('ins.adsbygoogle')
        if (insElement) {
          // If status is already populated by server-side/early render, check it immediately
          const initialStatus = insElement.getAttribute('data-ad-status')
          if (initialStatus === 'filled') {
            setAdStatus('filled')
          } else if (initialStatus === 'unfilled') {
            setAdStatus('unfilled')
          }

          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes') {
                const status = insElement.getAttribute('data-ad-status')
                if (status === 'filled') {
                  setAdStatus('filled')
                } else if (status === 'unfilled') {
                  setAdStatus('unfilled')
                }
              }
            })
          })

          observer.observe(insElement, { attributes: true })
          return () => {
            clearTimeout(timeoutId)
            observer.disconnect()
          }
        }
      }
    } catch (e) {
      console.log('AdSense error:', e)
      setAdStatus('unfilled')
    }

    return () => clearTimeout(timeoutId)
  }, [isPremium, pubId, adSlot, inView])

  // Don't render for premium users
  if (isPremium) return null

  // If no AdSense config, or if Google explicitly returned "unfilled", show a fallback internal ad
  if (!pubId || !adSlot || adStatus === 'unfilled') {
    return <FallbackAd />
  }

  const minHeight = format === 'vertical' ? '600px' : format === 'rectangle' ? '250px' : '90px'

  return (
    <div className="mb-6">
      <div 
        ref={adRef} 
        className="bg-surface border border-border rounded-2xl overflow-hidden" 
        style={{ minHeight }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight }}
          data-ad-client={pubId}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
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
  
  const [ad, setAd] = useState<typeof ads[0] | null>(null)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ads.length)
    setAd(ads[randomIndex])
  }, [])

  if (!ad) {
    // Render a clean, height-stable skeleton to prevent Cumulative Layout Shift (CLS)
    return (
      <div className="mb-6 h-[116px] bg-surface border border-border/50 rounded-2xl animate-pulse" />
    )
  }

  return (
    <div className="mb-6">
      <Link href={ad.link} className={`block bg-gradient-to-r ${ad.gradient} rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Sponsored</p>
        <h3 className="text-white font-bold text-lg mb-1">{ad.title}</h3>
        <p className="text-white/80 text-sm">{ad.desc}</p>
      </Link>
      <div className="flex items-center justify-center gap-2 mt-2">
        <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
        <Link href="/dashboard/upgrade" className="text-xs text-muted hover:text-amber-500 transition-colors">
          Remove ads with Premium
        </Link>
      </div>
    </div>
  )
}
