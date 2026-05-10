'use client'

import { AlertTriangle, Lock, ShieldCheck, TrendingDown, Clock, Crown } from 'lucide-react'
import Link from 'next/link'

interface PredictiveWarningProps {
  isPremium: boolean
  currentStreak: number
  totalRelapses: number
  averageStreak: number
  lastUrgeIntensity: number
  lastUrgeTime: Date | null
}

export default function PredictiveWarning({
  isPremium,
  currentStreak,
  totalRelapses,
  averageStreak,
  lastUrgeIntensity,
  lastUrgeTime
}: PredictiveWarningProps) {
  
  if (!isPremium) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center p-6 text-center">
          <Crown className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-lg font-bold mb-1">Predictive Relapse Warnings</h3>
          <p className="text-sm text-muted max-w-md mb-4">
            Unlock AI-driven pattern recognition to get warned before you relapse based on your historical data.
          </p>
          <Link href="/dashboard/upgrade" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md">
            Unlock Premium
          </Link>
        </div>
        
        {/* Blurred background content */}
        <div className="opacity-40 pointer-events-none filter blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold">Elevated Risk Detected</h3>
              <p className="text-xs text-muted">AI Pattern Analysis</p>
            </div>
          </div>
          <p className="text-sm">Based on your history, you usually struggle around Day 7. Be extra careful today.</p>
        </div>
      </div>
    )
  }

  // Basic predictive logic
  let riskLevel = 'Low'
  let riskColor = 'text-emerald-500'
  let riskBg = 'bg-emerald-500/10'
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-500" />
  let message = "Your patterns look stable. Keep up the great work and stay mindful."

  const isNearingAverageRelapse = averageStreak > 0 && Math.abs(currentStreak - averageStreak) <= 1
  const hadRecentStrongUrge = lastUrgeTime && (new Date().getTime() - lastUrgeTime.getTime() < 24 * 60 * 60 * 1000) && lastUrgeIntensity >= 7

  if (hadRecentStrongUrge) {
    riskLevel = 'High'
    riskColor = 'text-red-500'
    riskBg = 'bg-red-500/10'
    icon = <TrendingDown className="w-5 h-5 text-red-500" />
    message = `You logged a strong urge recently (Intensity: ${lastUrgeIntensity}/10). Your risk of relapse is currently high. Please use the SOS tools if needed.`
  } else if (isNearingAverageRelapse && totalRelapses > 1) {
    riskLevel = 'Medium'
    riskColor = 'text-amber-500'
    riskBg = 'bg-amber-500/10'
    icon = <Clock className="w-5 h-5 text-amber-500" />
    message = `Pattern alert: You historically struggle around Day ${averageStreak}. You are currently on Day ${currentStreak}. Stay vigilant today.`
  }

  return (
    <div className={`border rounded-2xl p-6 shadow-sm mb-8 transition-colors ${riskLevel === 'High' ? 'bg-red-500/5 border-red-500/20' : riskLevel === 'Medium' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-surface border-border'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${riskBg}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              Predictive Analysis
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold ${riskLevel === 'High' ? 'bg-red-500/20 text-red-500' : riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                {riskLevel} Risk
              </span>
            </h3>
            <p className="text-xs text-muted">Based on your historical patterns</p>
          </div>
        </div>
      </div>
      <p className="text-sm mt-3 font-medium">{message}</p>
      
      {riskLevel !== 'Low' && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <Link href="/dashboard/sos" className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${riskLevel === 'High' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400'}`}>
            Go to SOS Mode
          </Link>
        </div>
      )}
    </div>
  )
}
