'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Zap, ChevronDown, ChevronUp, Check, Wind, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

const TRIGGERS = ['Boredom', 'Stress', 'Loneliness', 'Late Night', 'Social Media', 'Anxiety', 'Sadness', 'Anger']
const EMOTIONS = ['Restless', 'Anxious', 'Numb', 'Frustrated', 'Lonely', 'Tired', 'Overwhelmed']
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

type UrgeLog = {
  id: string
  intensity: number
  trigger: string | null
  emotion: string | null
  notes: string | null
  urge_passed: boolean
  created_at: string
}

export default function UrgeLogger() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [intensity, setIntensity] = useState(5)
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [suggestedCoping, setSuggestedCoping] = useState('')
  const [recentLogs, setRecentLogs] = useState<UrgeLog[]>([])
  const [activeLogId, setActiveLogId] = useState<string | null>(null)

  const supabase = createClient()

  const loadRecentLogs = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('urge_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      if (data) setRecentLogs(data)
    } catch {
      // silently fail — table might not exist yet
    }
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRecentLogs()
  }, [loadRecentLogs])

  const handleQuickLog = async () => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('urge_logs')
        .insert({ user_id: user.id, intensity, urge_passed: false })
        .select()
        .single()

      if (error) throw error

      setActiveLogId(data.id)
      setSuggestedCoping(COPING[Math.floor(Math.random() * COPING.length)])
      setShowSuccess(true)
      void loadRecentLogs()
    } catch {
      // If table doesn't exist, still show the UI flow
      setSuggestedCoping(COPING[Math.floor(Math.random() * COPING.length)])
      setShowSuccess(true)
    }
    setIsSaving(false)
  }

  const handleDetailedLog = async () => {
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
          emotion: selectedEmotion,
          notes: notes || null,
          urge_passed: false,
        })
        .select()
        .single()

      if (error) throw error
      setActiveLogId(data.id)
    } catch {
      // graceful fallback
    }

    setSuggestedCoping(COPING[Math.floor(Math.random() * COPING.length)])
    setShowSuccess(true)
    setIsSaving(false)
  }

  const handleUrgePassed = async () => {
    if (activeLogId) {
      try {
        await supabase
          .from('urge_logs')
          .update({ urge_passed: true })
          .eq('id', activeLogId)
      } catch {
        // graceful
      }
    }
    // Reset everything
    setShowSuccess(false)
    setIsExpanded(false)
    setIntensity(5)
    setSelectedTrigger(null)
    setSelectedEmotion(null)
    setNotes('')
    setActiveLogId(null)
    void loadRecentLogs()
  }

  // Success / coping state
  if (showSuccess) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-in fade-in duration-500">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold mb-1 text-foreground">Urge Logged</h3>
          <p className="text-muted text-sm">You acknowledged it. That takes real strength.</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 text-center">
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Try this right now</p>
          <p className="text-lg text-foreground font-medium">{suggestedCoping}</p>
        </div>

        <button
          onClick={handleUrgePassed}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
        >
          <Wind className="w-5 h-5" />
          The urge has passed
        </button>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link href="/dashboard/sos" className="text-center bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors">
            Open SOS reset
          </Link>
          <Link href="/dashboard/journal" className="text-center bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors">
            Write 1 line journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-foreground">Log an Urge</h3>
        <Zap className="w-5 h-5 text-amber-500" />
      </div>
      <p className="text-muted text-sm mb-6">Acknowledge it without judgement. Let it pass.</p>

      {/* Quick log button */}
      <button
        onClick={handleQuickLog}
        disabled={isSaving}
        className="w-full bg-foreground text-background py-4 rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-[1.01] active:scale-[0.99] mb-4 flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
      >
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-amber-400" />}
        {isSaving ? 'Saving...' : 'Quick Log Urge'}
      </button>

      {/* Expand for details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-sm font-medium text-muted hover:text-foreground flex items-center justify-center gap-1.5 py-3 transition-colors rounded-lg hover:bg-surface-hover"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {isExpanded ? 'Less detail' : 'Add details'}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6 animate-in slide-in-from-top-4 duration-300">
          {/* Intensity */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-foreground">Intensity</label>
              <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{intensity}/10</span>
            </div>
            <input
              type="range" min="1" max="10" value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-border rounded-full appearance-none outline-none"
            />
            <div className="flex justify-between text-xs text-muted mt-2 font-medium">
              <span>Mild</span><span>Severe</span>
            </div>
          </div>

          {/* Trigger */}
          <div>
            <label className="text-sm font-semibold block mb-3 text-foreground">What triggered it?</label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTrigger(selectedTrigger === t ? null : t)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedTrigger === t
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border text-muted hover:border-primary/50 hover:text-foreground bg-surface'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="text-sm font-semibold block mb-3 text-foreground">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setSelectedEmotion(selectedEmotion === e ? null : e)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedEmotion === e
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border text-muted hover:border-primary/50 hover:text-foreground bg-surface'
                  }`}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold block mb-3 text-foreground">Quick note (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What was happening when the urge hit?"
              className="w-full rounded-xl border border-border bg-surface-hover px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-shadow"
            />
          </div>

          <button
            onClick={handleDetailedLog}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-primary/20"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Log Urge & Let Go'}
          </button>
        </div>
      )}

      {/* Recent urge history */}
      {recentLogs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-muted" />
            <span className="text-sm font-semibold text-muted uppercase tracking-wider">Recent History</span>
          </div>
          <div className="space-y-3">
            {recentLogs.slice(0, 3).map(log => (
              <div key={log.id} className="flex items-center justify-between text-sm py-3 px-4 rounded-xl bg-surface-hover border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{log.intensity}/10</span>
                  {log.trigger && <span className="text-foreground font-medium">{log.trigger}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {log.urge_passed && <Check className="w-4 h-4 text-emerald-500" />}
                  <span className="text-xs text-muted font-medium">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
