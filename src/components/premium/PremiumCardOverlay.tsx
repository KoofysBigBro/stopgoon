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
    glow: 'bg-primary/20',
    iconBg: 'bg-primary/10 border-primary/20',
    iconColor: 'text-primary',
    button: 'bg-primary hover:bg-primary-hover text-surface shadow-primary/20',
  },
  indigo: {
    glow: 'bg-accent/20',
    iconBg: 'bg-accent/10 border-accent/20',
    iconColor: 'text-accent',
    button: 'bg-accent hover:opacity-90 text-white shadow-accent/20',
  },
  amber: {
    glow: 'bg-amber-500/20',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-500',
    button: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
  },
  emerald: {
    glow: 'bg-emerald-500/20',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20',
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
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none blur-sm grayscale mix-blend-luminosity">
          {children}
        </div>
      )}

      {/* Premium Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-surface via-surface/95 to-surface/80">
        
        {/* Subtle top glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 ${v.glow} blur-[60px] opacity-50 rounded-full pointer-events-none`} />

        {/* Polished Icon Container */}
        <div className="relative mb-5">
          <div className={`w-14 h-14 rounded-2xl border ${v.iconBg} flex items-center justify-center shadow-lg backdrop-blur-md relative z-10`}>
            {icon ? (
              <div className={`[&>svg]:w-6 [&>svg]:h-6 [&>svg]:${v.iconColor}`}>
                {icon}
              </div>
            ) : (
              <Crown className={`w-6 h-6 ${v.iconColor}`} />
            )}
          </div>
          {/* Lock Badge */}
          <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-surface border border-border rounded-full flex items-center justify-center shadow-md z-20">
            <Lock className="w-3.5 h-3.5 text-muted" />
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
