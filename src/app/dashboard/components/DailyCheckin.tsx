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
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Checked in</h3>
        </div>
        <p className="text-muted text-sm">
          You're feeling <strong>{saved}</strong> today. Thanks for being honest with yourself.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-2 text-foreground">Daily Check-in</h3>
      <p className="text-muted text-sm mb-5">How are you feeling today?</p>

      <div className="flex flex-wrap gap-3">
        {MOODS.map(mood => (
          <button
            key={mood.value}
            onClick={() => handleCheckin(mood.value)}
            disabled={isSaving}
            className={`flex-1 py-3.5 px-4 rounded-xl border border-border font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 bg-surface text-foreground
              ${mood.color === 'emerald' ? 'hover:border-emerald-500 hover:bg-emerald-500/5' : ''}
              ${mood.color === 'indigo' ? 'hover:border-indigo-500 hover:bg-indigo-500/5' : ''}
              ${mood.color === 'amber' ? 'hover:border-amber-500 hover:bg-amber-500/5' : ''}
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
