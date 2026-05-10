'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Zap, ChevronDown, ChevronUp, Check, Wind, Clock, Loader2 } from 'lucide-react'

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

  useEffect(() => {
    loadRecentLogs()
  }, [])

  const loadRecentLogs = async () => {
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
  }

  const handleQuickLog = async () => {
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from('urge_logs')
        .insert({ intensity: 5, urge_passed: false })
        .select()
        .single()

      if (error) throw error

      setActiveLogId(data.id)
      setSuggestedCoping(COPING[Math.floor(Math.random() * COPING.length)])
      setShowSuccess(true)
      loadRecentLogs()
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
      const { data, error } = await supabase
        .from('urge_logs')
        .insert({
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
    loadRecentLogs()
  }

  // Success / coping state
  if (showSuccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-1">Urge Logged</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">You acknowledged it. That takes real strength.</p>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">Try this:</p>
          <p className="text-indigo-700 dark:text-indigo-300">{suggestedCoping}</p>
        </div>

        <button
          onClick={handleUrgePassed}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Wind className="w-5 h-5" />
          The urge has passed
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">Log an Urge</h3>
        <Zap className="w-5 h-5 text-amber-500" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Acknowledge it. Let it pass.</p>

      {/* Quick log button */}
      <button
        onClick={handleQuickLog}
        disabled={isSaving}
        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3.5 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors mb-3 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
        {isSaving ? 'Saving...' : 'Quick Log Urge'}
      </button>

      {/* Expand for details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center gap-1 py-2 transition-colors"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {isExpanded ? 'Less detail' : 'Add details'}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-5 animate-in slide-in-from-top-2 duration-200">
          {/* Intensity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold">Intensity</label>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{intensity}/10</span>
            </div>
            <input
              type="range" min="1" max="10" value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Mild</span><span>Severe</span>
            </div>
          </div>

          {/* Trigger */}
          <div>
            <label className="text-sm font-semibold block mb-2">What triggered it?</label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTrigger(selectedTrigger === t ? null : t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedTrigger === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="text-sm font-semibold block mb-2">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setSelectedEmotion(selectedEmotion === e ? null : e)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedEmotion === e
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold block mb-2">Quick note (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What was happening when the urge hit?"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={handleDetailedLog}
            disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Log Urge & Let Go'}
          </button>
        </div>
      )}

      {/* Recent urge history */}
      {recentLogs.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Recent</span>
          </div>
          <div className="space-y-2">
            {recentLogs.slice(0, 3).map(log => (
              <div key={log.id} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.intensity}/10</span>
                  {log.trigger && <span className="text-slate-500 dark:text-slate-400">{log.trigger}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {log.urge_passed && <Check className="w-4 h-4 text-emerald-500" />}
                  <span className="text-xs text-slate-400">
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
