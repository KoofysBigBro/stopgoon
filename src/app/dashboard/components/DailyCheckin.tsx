'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'

const MOODS = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'struggling', emoji: '😔', label: 'Hard' },
]

export default function DailyCheckin() {
  const [saved, setSaved] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const checkToday = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: relapses } = await supabase
        .from('relapses')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const lastRelapseDate = relapses && relapses.length > 0 ? new Date(relapses[0].created_at) : new Date(0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const checkinStartTime = new Date(Math.max(today.getTime(), lastRelapseDate.getTime()))

      const { data } = await supabase
        .from('daily_checkins')
        .select('mood')
        .eq('user_id', user.id)
        .gte('created_at', checkinStartTime.toISOString())
        .limit(1)

      if (data && data.length > 0) {
        setSaved(data[0].mood)
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to load checkins:', e)
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    void checkToday()
  }, [checkToday])

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const handleCheckin = async (mood: string) => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('daily_checkins').insert({ user_id: user.id, mood })
      if (error) {
        if (process.env.NODE_ENV === 'development') console.error('Checkin failed:', error)
      } else {
        setSaved(mood)
        setIsOpen(false)
        router.refresh()
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('Exception during checkin:', e)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-xl font-semibold text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Check In</span>
      </div>
    )
  }

  // Already checked in
  if (saved) {
    const mood = MOODS.find(m => m.value === saved)
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-3 rounded-xl font-semibold text-sm">
        <Check className="w-4 h-4" />
        <span>Checked in {mood?.emoji}</span>
      </div>
    )
  }

  // Compact check-in button + popover
  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary text-white hover:bg-primary-hover px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        <Check className="w-4 h-4" />
        Check In
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-surface border border-border rounded-2xl p-4 shadow-2xl shadow-black/30 z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[220px]">
          <p className="text-xs text-muted font-medium text-center mb-3">How are you feeling?</p>
          <div className="flex gap-2">
            {MOODS.map(mood => (
              <button
                key={mood.value}
                onClick={() => handleCheckin(mood.value)}
                disabled={isSaving}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[10px] font-semibold text-muted">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
