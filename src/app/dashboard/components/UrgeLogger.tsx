'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Zap, ChevronDown, ChevronUp, Check, Wind, Loader2 } from 'lucide-react'
import Link from 'next/link'

const TRIGGERS = ['Boredom', 'Stress', 'Loneliness', 'Late Night', 'Social Media', 'Anxiety']
const COPING = [
  'Take 10 deep breaths',
  'Do 20 pushups',
  'Splash cold water on your face',
  'Go for a short walk',
  'Text someone you trust',
  'Open the SOS breathing tool',
  'Write in your journal',
  'Drink a glass of water',
]

export default function UrgeLogger() {
  const [intensity, setIntensity] = useState(5)
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [suggestedCoping, setSuggestedCoping] = useState('')
  const [activeLogId, setActiveLogId] = useState<string | null>(null)

  const supabase = createClient()

  const getIntensityLabel = (val: number) => {
    if (val <= 3) return 'Mild'
    if (val <= 6) return 'Moderate'
    if (val <= 8) return 'Strong'
    return 'Severe'
  }

  const getIntensityColor = (val: number) => {
    if (val <= 3) return 'text-emerald-400'
    if (val <= 6) return 'text-amber-400'
    if (val <= 8) return 'text-orange-400'
    return 'text-red-400'
  }

  const handleLog = async () => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('urge_logs')
        .insert({
          user_id: user.id,
          intensity,
          trigger: selectedTrigger,
          urge_passed: false,
        })
        .select()
        .single()

      if (error) throw error

      setActiveLogId(data.id)
      setSuggestedCoping(COPING[Math.floor(Math.random() * COPING.length)])
      setShowSuccess(true)
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to log urge:', e)
      setSuggestedCoping(COPING[Math.floor(Math.random() * COPING.length)])
      setShowSuccess(true)
    }
    setIsSaving(false)
  }

  const handleUrgePassed = async () => {
    if (activeLogId) {
      try {
        await supabase
          .from('urge_logs')
          .update({ urge_passed: true })
          .eq('id', activeLogId)
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.error('Failed to update urge:', e)
      }
    }
    setShowSuccess(false)
    setShowDetails(false)
    setIntensity(5)
    setSelectedTrigger(null)
    setActiveLogId(null)
  }

  // Success state — minimal and encouraging
  if (showSuccess) {
    return (
      <div className="rounded-2xl border border-border/40 bg-surface/60 p-6 animate-in fade-in duration-300">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="font-semibold text-foreground">Urge logged</p>
          <p className="text-xs text-muted mt-1">You acknowledged it. That takes strength.</p>
        </div>

        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-4 text-center">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">Try this now</p>
          <p className="text-sm text-foreground font-medium">{suggestedCoping}</p>
        </div>

        <button
          onClick={handleUrgePassed}
          className="w-full bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Wind className="w-4 h-4" />
          The urge has passed
        </button>

        <div className="flex gap-2 mt-3">
          <Link href="/dashboard/sos" className="flex-1 text-center bg-surface/60 border border-border/40 rounded-xl px-3 py-2.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors">
            Open SOS
          </Link>
          <Link href="/dashboard/journal" className="flex-1 text-center bg-surface/60 border border-border/40 rounded-xl px-3 py-2.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors">
            Journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-surface/60 p-6 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Log an urge</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${getIntensityColor(intensity)}`}>
            {getIntensityLabel(intensity)}
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums">{intensity}/10</span>
        </div>
      </div>

      {/* Intensity slider */}
      <div className="mb-4">
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          aria-label="Urge intensity"
          className="w-full accent-primary h-1.5 bg-border/40 rounded-full appearance-none outline-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted/60 mt-1.5 font-medium px-0.5">
          <span>Mild</span>
          <span>Severe</span>
        </div>
      </div>

      {/* Optional details toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-xs font-medium text-muted/70 hover:text-muted flex items-center justify-center gap-1 py-1.5 mb-4 transition-colors"
      >
        {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showDetails ? 'Hide triggers' : 'Add trigger'}
      </button>

      {showDetails && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap gap-1.5">
            {TRIGGERS.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTrigger(selectedTrigger === t ? null : t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  selectedTrigger === t
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'border-border/40 text-muted hover:border-border hover:text-foreground'
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* Log button */}
      <button
        onClick={handleLog}
        disabled={isSaving}
        className="w-full bg-foreground text-background py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {isSaving ? 'Logging...' : 'Log'}
      </button>
    </div>
  )
}
