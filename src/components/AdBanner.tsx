'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import Link from 'next/link'

const AD_CONTENT = [
  {
    title: 'Master Your Mind',
    description: 'Build unshakeable discipline with proven recovery techniques.',
    gradient: 'from-indigo-600 to-purple-600',
    cta: 'Start Free',
    link: '/dashboard'
  },
  {
    title: 'Track Your Progress',
    description: 'See how far you\'ve come with detailed analytics and insights.',
    gradient: 'from-emerald-600 to-teal-600',
    cta: 'View Analytics',
    link: '/dashboard/analytics'
  },
  {
    title: 'Go Premium ✨',
    description: 'Unlock AI coaching, custom routines, and an ad-free experience.',
    gradient: 'from-amber-500 to-orange-600',
    cta: 'Upgrade Now',
    link: '/dashboard/upgrade'
  },
  {
    title: 'You\'re Not Alone',
    description: 'Join the community chat and connect with people on the same journey.',
    gradient: 'from-pink-500 to-rose-600',
    cta: 'Join Chat',
    link: '/dashboard/chat'
  },
  {
    title: 'Emergency? Hit SOS',
    description: 'Breathing exercises and grounding techniques when you need them most.',
    gradient: 'from-red-500 to-red-700',
    cta: 'SOS Mode',
    link: '/dashboard/sos'
  }
]

export default function AdBanner({ isPremium }: { isPremium: boolean }) {
  const [currentAd, setCurrentAd] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  // Rotate ads every 15 seconds
  useEffect(() => {
    if (isPremium || dismissed) return
    const timer = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % AD_CONTENT.length)
    }, 15000)
    return () => clearInterval(timer)
  }, [isPremium, dismissed])

  // Don't render for premium users
  if (isPremium || dismissed) return null

  const ad = AD_CONTENT[currentAd]

  return (
    <div className="relative mb-6 animate-in fade-in duration-300">
      <div className={`bg-gradient-to-r ${ad.gradient} rounded-2xl p-5 pr-12 shadow-lg overflow-hidden relative`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
        
        <div className="relative z-10">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Sponsored</p>
          <h3 className="text-white font-bold text-lg mb-1">{ad.title}</h3>
          <p className="text-white/80 text-sm mb-3">{ad.description}</p>
          <Link
            href={ad.link}
            className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            {ad.cta}
          </Link>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
          title="Dismiss ad"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ad dots */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {AD_CONTENT.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentAd(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentAd ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Upgrade CTA below ad */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Sparkles className="w-3 h-3 text-amber-500" />
        <Link href="/dashboard/upgrade" className="text-xs text-muted hover:text-amber-500 transition-colors">
          Remove ads with Premium
        </Link>
      </div>
    </div>
  )
}
