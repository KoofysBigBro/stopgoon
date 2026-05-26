'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import { trackGAEvent } from '@/utils/analytics'
import UpgradeButton from './UpgradeButton'

interface PremiumOverlayProps {
  title?: string
  description?: string
  location?: string
  children?: React.ReactNode
}

export default function PremiumOverlay({
  title = 'Advanced Recovery Insights',
  description = 'See patterns, triggers, and recovery trends over time.',
  location = 'premium_analytics_card',
  children,
}: PremiumOverlayProps) {
  
  const handleOverlayClick = () => {
    trackGAEvent('premium_overlay_clicked', { location })
  }

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border border-border/40 bg-surface/30 group"
      onClick={handleOverlayClick}
    >
      {/* Blurred background content */}
      <div className="blur-[8px] select-none pointer-events-none opacity-20 filter scale-[1.01] transition-all duration-300">
        {children}
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-background/95 via-background/90 to-background/70 backdrop-blur-[2px]">
        {/* Subtle glowing background orbs */}
        <div className="absolute w-36 h-36 rounded-full bg-primary/10 blur-3xl -top-12 -left-12 pointer-events-none" />
        <div className="absolute w-36 h-36 rounded-full bg-indigo-500/10 blur-3xl -bottom-12 -right-12 pointer-events-none" />

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-surface border border-border/80 flex items-center justify-center mb-5 shadow-2xl relative transition-transform duration-500 group-hover:scale-110">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          {/* Subtle outer glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted max-w-xs mb-6 leading-relaxed">
          {description}
        </p>

        {/* Upgrade CTA */}
        <UpgradeButton location={location} />
      </div>
    </div>
  )
}
