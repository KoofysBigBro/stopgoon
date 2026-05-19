import { createClient } from '@/utils/supabase/server'
import dynamicImport from 'next/dynamic'
import { Flame, Calendar, TrendingUp, BookHeart, Zap, Target } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import SectionCard from '../components/ui/SectionCard'

const MoodBreakdownChart = dynamicImport(() => import('./MoodBreakdownChart'), {
  loading: () => <div className="h-20 rounded-xl bg-surface-hover animate-pulse" />,
})
const AICoach = dynamicImport(() => import('../components/AICoach'), {
  loading: () => <div className="h-56 rounded-2xl bg-surface-hover animate-pulse" />,
})
const PredictiveWarning = dynamicImport(() => import('./PredictiveWarning'), {
  loading: () => <div className="h-28 rounded-2xl bg-surface-hover animate-pulse mb-8" />,
})
const RecoveryTimeline = dynamicImport(() => import('./RecoveryTimeline'), {
  loading: () => <div className="h-64 rounded-2xl bg-surface-hover animate-pulse" />,
})
export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let totalCheckins = 0
  let totalJournalEntries = 0
  let totalUrges = 0
  let totalSetbacks = 0
  let currentStreak = 0
  let longestStreak = 0
  let averageIntensity = 0
  let checkinCalendar: { date: string; count: number }[] = []
  const moodCounts: Record<string, number> = {}
  let isPremium = false;

  // Predictive & Timeline data
  let averageStreak = 0;
  let lastUrgeIntensity = 0;
  let lastUrgeTime: Date | null = null;
  const timelineEvents: { id: string; type: 'start' | 'relapse' | 'milestone' | 'journal'; date: Date; title: string; description?: string }[] = [];

  if (user) {
    const [{ data: profile }, { data: relapses }, { data: checkins }, { data: journals, count: journalCount }, { data: urges }] = await Promise.all([
      supabase.from('users').select('subscription_tier').eq('id', user.id).single(),
      supabase.from('relapses').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('daily_checkins').select('created_at, mood').eq('user_id', user.id).order('created_at', { ascending: true }),
      supabase.from('journal_entries').select('id, created_at, reflection', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('urge_logs').select('intensity, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])

    isPremium = profile?.subscription_tier === 'premium';
    totalSetbacks = relapses?.length || 0
    totalCheckins = checkins?.length || 0
    totalJournalEntries = journalCount || 0

    const lastRelapseDate = relapses && relapses.length > 0 ? new Date(relapses[0].created_at) : new Date(user.created_at)

    if (checkins) {
      checkins.forEach(c => { if (c.mood) moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1 })

      const sinceRelapse = checkins.filter(c => new Date(c.created_at) >= lastRelapseDate)
      currentStreak = sinceRelapse.length

      const allDates = [...new Set(checkins.map(c => new Date(c.created_at).toISOString().split('T')[0]))].sort()
      let streak = 1
      for (let i = 1; i < allDates.length; i++) {
        const prev = new Date(allDates[i - 1])
        const curr = new Date(allDates[i])
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) { streak++; longestStreak = Math.max(longestStreak, streak) }
        else { streak = 1 }
      }

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
      thirtyDaysAgo.setHours(0, 0, 0, 0)
      const calendarMap: Record<string, number> = {}
      for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo)
        d.setDate(d.getDate() + i)
        calendarMap[d.toISOString().split('T')[0]] = 0
      }
      checkins.forEach(c => {
        const key = new Date(c.created_at).toISOString().split('T')[0]
        if (calendarMap[key] !== undefined) calendarMap[key]++
      })
      checkinCalendar = Object.entries(calendarMap).map(([date, count]) => ({ date, count }))
    }

    totalUrges = urges?.length || 0
    if (urges && urges.length > 0) {
      const sum = urges.reduce((acc, u) => acc + (u.intensity || 0), 0)
      averageIntensity = Math.round((sum / urges.length) * 10) / 10
      lastUrgeIntensity = urges[0].intensity || 0;
      lastUrgeTime = new Date(urges[0].created_at);
    }

    // Build Timeline Events
    timelineEvents.push({
      id: 'start',
      type: 'start',
      date: new Date(user.created_at),
      title: 'Journey Began',
      description: 'You made the decision to start your recovery journey.'
    });

    if (relapses) {
      relapses.forEach((r, i) => {
        timelineEvents.push({
          id: `relapse-${i}`,
          type: 'relapse',
          date: new Date(r.created_at),
          title: 'Setback Logged',
          description: 'A bump in the road. Recovery is not linear.'
        });
      });
      // Calculate average streak
      if (relapses.length > 1) {
        const relapseDates = relapses.map(r => new Date(r.created_at).getTime()).sort();
        let totalDays = 0;
        for(let i = 1; i < relapseDates.length; i++) {
          totalDays += (relapseDates[i] - relapseDates[i-1]) / (1000 * 60 * 60 * 24);
        }
        averageStreak = Math.round(totalDays / (relapseDates.length - 1));
      } else if (relapses.length === 1) {
        averageStreak = Math.round((new Date(relapses[0].created_at).getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    if (journals) {
      journals.forEach((j) => {
        timelineEvents.push({
          id: `journal-${j.id}`,
          type: 'journal',
          date: new Date(j.created_at),
          title: 'Journal Entry',
          description: j.reflection ? (j.reflection.substring(0, 60) + '...') : 'Logged thoughts and feelings.'
        });
      });
    }

    // Add milestone if current streak > 0
    if (currentStreak > 0) {
      let milestoneTitle = '';
      if (currentStreak >= 365) milestoneTitle = '1 Year Clean!';
      else if (currentStreak >= 100) milestoneTitle = '100 Days Clean!';
      else if (currentStreak >= 30) milestoneTitle = '30 Days Clean!';
      else if (currentStreak >= 7) milestoneTitle = '1 Week Clean!';
      
      if (milestoneTitle) {
        timelineEvents.push({
          id: `milestone-current`,
          type: 'milestone',
          date: new Date(),
          title: milestoneTitle,
          description: `You are currently on a ${currentStreak} day streak.`
        });
      }
    }

    // Sort timeline descending
    timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Analytics</h1>
        <p className="text-sm text-muted font-medium">Your progress data, simplified.</p>
      </div>

      {/* AI Coach */}
      <div className="mb-8">
        <AICoach isPremium={isPremium} />
      </div>

      {/* Predictive Warning */}
      <PredictiveWarning 
        isPremium={isPremium}
        currentStreak={currentStreak}
        totalRelapses={totalSetbacks}
        averageStreak={averageStreak}
        lastUrgeIntensity={lastUrgeIntensity}
        lastUrgeTime={lastUrgeTime}
      />

      {/* Stat Cards - Consolidated & Clean */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
          <Flame className="w-5 h-5 text-primary mb-2 opacity-80" />
          <p className="text-3xl font-bold text-foreground tracking-tight">{currentStreak}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">Current Streak</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
          <Target className="w-5 h-5 text-amber-500 mb-2 opacity-80" />
          <p className="text-3xl font-bold text-foreground tracking-tight">{longestStreak}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">Longest Streak</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-5 h-5 text-rose-500 mb-2 opacity-80" />
          <p className="text-3xl font-bold text-foreground tracking-tight">{totalSetbacks}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">Setbacks</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
          <Calendar className="w-5 h-5 text-emerald-500 mb-2 opacity-80" />
          <p className="text-3xl font-bold text-foreground tracking-tight">{totalCheckins}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">Check-ins</p>
        </div>
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
          <BookHeart className="w-5 h-5 text-primary mb-2 opacity-80" />
          <p className="text-3xl font-bold text-foreground tracking-tight">{totalJournalEntries}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">Journals</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-border/40 flex flex-col items-center justify-center text-center">
          <Zap className="w-5 h-5 text-orange-500 mb-2 opacity-80" />
          <p className="text-3xl font-bold text-foreground tracking-tight">{totalUrges}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">Urges Logged</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-border/40 col-span-1 lg:col-span-1 flex items-center justify-center">
          <MoodBreakdownChart moodCounts={moodCounts} totalCheckins={totalCheckins} />
        </div>
      </div>

      {/* 30-Day Activity Heatmap */}
      <div className="glass-card p-8 rounded-[2rem] border border-border/40 mb-8">
        <div className="flex flex-col items-center text-center mb-8">
          <h3 className="font-bold text-lg tracking-tight text-foreground">30-Day Activity</h3>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {checkinCalendar.map((day) => {
            const d = new Date(day.date + 'T00:00:00')
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return (
              <div key={day.date} className="group relative" title={`${label}: ${day.count} check-in(s)`}>
                <div className={`aspect-square rounded-lg transition-all ${
                  day.count > 0
                    ? 'bg-primary shadow-[0_0_10px_rgb(44_199_165_/_0.35)]'
                    : 'bg-surface-hover border border-border opacity-50'
                }`} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center items-center gap-3 mt-6 text-[10px] font-bold tracking-wider text-muted uppercase">
          <span>Less</span>
          <div className="w-2 h-2 rounded-full bg-surface-hover border border-border opacity-50" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>More</span>
        </div>
      </div>

      {/* Recovery Timeline */}
      <div className="mt-8">
        <RecoveryTimeline isPremium={isPremium} events={timelineEvents} />
      </div>
    </div>
  )
}
