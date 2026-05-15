'use client'

import { Crown, Sparkles, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

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
    gradient: 'from-primary/20 via-indigo-500/20 to-accent/10',
    button: 'from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-700',
    shadow: 'shadow-primary/20',
    glow: 'animate-glow-pulse',
    badge: 'bg-primary',
  },
  indigo: {
    gradient: 'from-indigo-500/20 via-purple-500/20 to-transparent',
    button: 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
    shadow: 'shadow-indigo-500/20',
    glow: 'animate-glow-pulse-indigo',
    badge: 'bg-indigo-600',
  },
  amber: {
    gradient: 'from-amber-500/20 via-orange-500/20 to-transparent',
    button: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
    shadow: 'shadow-amber-500/20',
    glow: 'animate-glow-pulse-amber',
    badge: 'bg-amber-500',
  },
  emerald: {
    gradient: 'from-emerald-500/20 via-teal-500/20 to-transparent',
    button: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
    shadow: 'shadow-emerald-500/20',
    glow: 'animate-glow-pulse',
    badge: 'bg-emerald-600',
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
  const v = variantStyles[variant]
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.setProperty('--mx', `${x * 8}deg`)
      card.style.setProperty('--my', `${y * 8}deg`)
    }
    card.addEventListener('mousemove', handleMouseMove)
    return () => card.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm group min-h-[280px]"
      style={{
        transform: 'perspective(800px) rotateX(calc(var(--my, 0deg))) rotateY(calc(var(--mx, 0deg)))',
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} animate-gradient-shift opacity-60`} />
      
      {/* Orbital glow orbs */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${v.badge}/20 blur-[60px] animate-orbit-drift`} />
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full ${v.badge}/10 blur-[60px] animate-orbit-drift`} style={{ animationDelay: '-6s' }} />

      {/* Shine sweep overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out" />
      </div>

      {/* Background blurred preview */}
      {children && (
        <div className="relative w-full h-full min-h-[280px] opacity-30 pointer-events-none select-none blur-[3px]">
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 md:p-8 text-center bg-background/40 backdrop-blur-md" role="region" aria-label="Premium feature locked">
        {/* Premium crown badge */}
        <div className={`relative mb-5 ${v.glow}`}>
          <div className={`w-14 h-14 rounded-2xl ${v.badge} flex items-center justify-center shadow-lg ${v.shadow} animate-float-drift`}>
            {icon || <Crown className="w-7 h-7 text-white" />}
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Lock className="w-2.5 h-2.5 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold font-heading mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted max-w-sm mb-5 leading-relaxed">{description}</p>
        
        {feature && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-5">
            <Sparkles className="w-3 h-3" />
            {feature}
          </div>
        )}

        <Link
          href="/dashboard/upgrade"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${v.button} transition-all duration-300 shadow-lg ${v.shadow} hover:scale-105 active:scale-95`}
        >
          <Sparkles className="w-4 h-4" />
          Unlock Premium
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
