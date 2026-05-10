'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, Loader2 } from 'lucide-react'

const MOODS = [
  { value: 'great', label: 'Great', emoji: '😊', color: 'emerald' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'indigo' },
  { value: 'struggling', label: 'Struggling', emoji: '😔', color: 'amber' },
]

export default function DailyCheckin() {
  const [saved, setSaved] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const handleCheckin = async (mood: string) => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('daily_checkins').insert({ user_id: user.id, mood })
    } catch {
      // graceful
    }
    setSaved(mood)
    setIsSaving(false)
  }

  if (saved) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold">Checked in</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          You&apos;re feeling <strong>{saved}</strong> today. Thanks for being honest with yourself.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-2">Daily Check-in</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">How are you feeling today?</p>

      <div className="flex flex-wrap gap-3">
        {MOODS.map(mood => (
          <button
            key={mood.value}
            onClick={() => handleCheckin(mood.value)}
            disabled={isSaving}
            className={`flex-1 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60
              ${mood.color === 'emerald' ? 'hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : ''}
              ${mood.color === 'indigo' ? 'hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : ''}
              ${mood.color === 'amber' ? 'hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : ''}
            `}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-lg">{mood.emoji}</span>}
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  )
}
