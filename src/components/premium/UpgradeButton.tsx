'use client'

import React from 'react'
import { Sparkles, Crown, ArrowRight } from 'lucide-react'
import { trackGAEvent } from '@/utils/analytics'

interface UpgradeButtonProps {
  location?: string
  variant?: 'default' | 'compact'
  className?: string
  onClick?: () => void
}

export default function UpgradeButton({
  location = 'dashboard_premium_card',
  variant = 'default',
  className = '',
  onClick,
}: UpgradeButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackGAEvent('upgrade_clicked', { location })
    if (onClick) {
      onClick()
    } else {
      window.location.href = '/dashboard/upgrade'
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-700 text-white text-xs font-bold transition-all duration-200 shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
        aria-label="Upgrade to Premium"
      >
        <Crown className="w-3.5 h-3.5 shrink-0 text-amber-300" />
        <span>Upgrade</span>
        <ArrowRight className="w-3 h-3 shrink-0" />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary via-indigo-600 to-primary hover:from-primary-hover hover:via-indigo-700 hover:to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary overflow-hidden group cursor-pointer ${className}`}
      aria-label="Unlock Premium Insights"
    >
      <div className="absolute inset-0 bg-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
        <span>Unlock Premium Insights</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>
    </button>
  )
}
