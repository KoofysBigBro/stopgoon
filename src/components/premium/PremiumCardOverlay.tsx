'use client'

import { Crown, Sparkles, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PremiumCardOverlayProps {
  title: string
  description: string
  feature?: string
  icon?: React.ReactNode
  variant?: 'default' | 'indigo' | 'amber' | 'emerald'
  children?: React.ReactNode
}

const variantStyles = {
  default: {
    glow: 'bg-primary/10',
    iconBg: 'bg-surface border-border/50',
    iconColor: 'text-primary',
    button: 'bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-primary shadow-lg',
  },
  indigo: {
    glow: 'bg-primary/20',
    iconBg: 'bg-surface border-primary/30',
    iconColor: 'text-primary',
    button: 'bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-primary shadow-lg',
  },
  amber: {
    glow: 'bg-amber-500/10',
    iconBg: 'bg-surface border-amber-500/30',
    iconColor: 'text-amber-500',
    button: 'bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-500 shadow-lg',
  },
  emerald: {
    glow: 'bg-emerald-500/10',
    iconBg: 'bg-surface border-emerald-500/30',
    iconColor: 'text-emerald-500',
    button: 'bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-500 shadow-lg',
  },
}

export default function PremiumCardOverlay({
  title,
  description,
  feature,
  icon,
  variant = 'default',
  children,
}: PremiumCardOverlayProps) {
  const v = variantStyles[variant] || variantStyles.default

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-surface/40 group min-h-[280px]">
      
      {/* Background Content (Subtly blurred and dimmed) */}
      {children && (
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none blur-sm grayscale mix-blend-luminosity overflow-hidden">
          {children}
        </div>
      )}

      {/* Premium Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center h-full min-h-[280px] bg-gradient-to-t from-surface via-surface/95 to-surface/80">
        
        {/* Subtle top glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 ${v.glow} blur-[60px] opacity-50 rounded-full pointer-events-none`} />

        {/* Polished Icon Container */}
        <div className="relative mb-6">
          <div className={`w-14 h-14 rounded-2xl border ${v.iconBg} flex items-center justify-center shadow-2xl backdrop-blur-md relative z-10`}>
            {icon ? (
              <div className={`[&>svg]:w-6 [&>svg]:h-6 ${v.iconColor}`}>
                {icon}
              </div>
            ) : (
              <Crown className={`w-6 h-6 ${v.iconColor}`} />
            )}
          </div>
          {/* Lock Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface border border-border/60 rounded-full flex items-center justify-center shadow-lg z-20">
            <Lock className="w-3 h-3 text-muted" />
          </div>
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted max-w-xs mb-6 leading-relaxed">{description}</p>
        
        {feature && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-6 px-3 py-1 rounded-full border border-border/50 bg-surface">
            <Sparkles className={`w-3.5 h-3.5 ${v.iconColor}`} />
            {feature}
          </div>
        )}

        <Link
          href="/dashboard/upgrade"
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg ${v.button} hover:-translate-y-0.5 active:translate-y-0`}
        >
          Unlock Premium
          <ArrowRight className="w-4 h-4 opacity-80" />
        </Link>
      </div>
    </div>
  )
}
