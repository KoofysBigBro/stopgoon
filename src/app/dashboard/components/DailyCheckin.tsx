'use client'

import { useState, useEffect } from 'react'
import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Star, Clock } from 'lucide-react'
import Link from 'next/link'

const MOODS = [
  { value: 'great', label: 'Great', emoji: '😊', color: 'emerald' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'indigo' },
  { value: 'struggling', label: 'Struggling', emoji: '😔', color: 'amber' },
]

export default function DailyCheckin() {
  const [saved, setSaved] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [streak, setStreak] = useState<{label: string, active: boolean}[]>([])
  const [timeLeft, setTimeLeft] = useState('')
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

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 6)
      weekAgo.setHours(0, 0, 0, 0)
      const fetchStart = new Date(Math.max(weekAgo.getTime(), lastRelapseDate.getTime()))

      const { data: weekCheckins } = await supabase
        .from('daily_checkins')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', fetchStart.toISOString())

      const streakArray = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const hasCheckin = weekCheckins?.some(c => {
          const cDate = new Date(c.created_at)
          return cDate.getDate() === d.getDate() && cDate.getMonth() === d.getMonth() && cDate.getFullYear() === d.getFullYear()
        }) || false
        streakArray.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0), active: hasCheckin })
      }
      setStreak(streakArray)
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkToday()
  }, [checkToday])

  useEffect(() => {
    if (!saved) return
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`${h}h ${m}m`)
    }
    updateTimer()
    const interval = setInterval(updateTimer, 60000)
    return () => clearInterval(interval)
  }, [saved])

  const handleCheckin = async (mood: string) => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('daily_checkins').insert({ user_id: user.id, mood })
      if (error) {
        console.error('Checkin failed:', error)
      } else {
        setSaved(mood)
        router.refresh()
        void checkToday()
      }
    } catch (e) {
      console.error('Exception during checkin:', e)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center h-[160px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted" />
      </div>
    )
  }

  if (saved) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Checked in</h3>
              <p className="text-muted text-sm flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                Resets in {timeLeft}
              </p>
            </div>
          </div>
        </div>
        
        {/* 7-Day Visual Streak Tracker */}
        <div className="bg-background/50 border border-border rounded-xl p-4 mt-6">
          <p className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">This Week&apos;s Consistency</p>
          <div className="flex justify-between items-center">
            {streak.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  day.active 
                    ? 'bg-amber-100 dark:bg-amber-900/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                    : 'bg-surface border border-border opacity-50'
                }`}>
                  <Star className={`w-4 h-4 ${day.active ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                </div>
                <span className="text-xs font-medium text-muted">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Next step</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/journal" className="px-3 py-2 text-xs font-bold rounded-lg bg-background border border-border hover:bg-surface-hover transition-colors">Write one reflection</Link>
            <Link href="/dashboard/analytics" className="px-3 py-2 text-xs font-bold rounded-lg bg-background border border-border hover:bg-surface-hover transition-colors">Review today&apos;s trend</Link>
          </div>
        </div>
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

      {/* 7-Day Visual Streak Tracker (Visible before checkin too) */}
      <div className="bg-background/50 border border-border rounded-xl p-4 mt-8">
        <p className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">This Week&apos;s Consistency</p>
        <div className="flex justify-between items-center">
          {streak.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                day.active 
                  ? 'bg-amber-100 dark:bg-amber-900/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : 'bg-surface border border-border opacity-50'
              }`}>
                <Star className={`w-4 h-4 ${day.active ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
              </div>
              <span className="text-xs font-medium text-muted">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
