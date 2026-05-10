import { createClient } from '@/utils/supabase/server'
import { Flame, Calendar, TrendingUp, BookHeart, Zap, Target } from 'lucide-react'
import MoodBreakdownChart from './MoodBreakdownChart'
import AICoach from '../components/AICoach'
import PredictiveWarning from './PredictiveWarning'
import RecoveryTimeline from './RecoveryTimeline'
export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let totalCheckins = 0
  let totalJournalEntries = 0
  let totalUrges = 0
  let totalRelapses = 0
  let currentStreak = 0
  let longestStreak = 0
  let averageIntensity = 0
  let checkinCalendar: { date: string; count: number }[] = []
  let moodCounts: Record<string, number> = {}
  let isPremium = false;

  // Predictive & Timeline data
  let averageStreak = 0;
  let lastUrgeIntensity = 0;
  let lastUrgeTime: Date | null = null;
  const timelineEvents: { id: string; type: 'start' | 'relapse' | 'milestone' | 'journal'; date: Date; title: string; description?: string }[] = [];

  if (user) {
    // Fetch user for premium status
    const { data: profile } = await supabase.from('users').select('subscription_tier').eq('id', user.id).single();
    isPremium = profile?.subscription_tier === 'premium';
    // Fetch last relapse
    const { data: relapses } = await supabase
      .from('relapses')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    totalRelapses = relapses?.length || 0
    const lastRelapseDate = relapses && relapses.length > 0 ? new Date(relapses[0].created_at) : new Date(user.created_at)

    // Total checkins
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('created_at, mood')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    totalCheckins = checkins?.length || 0

    // Build mood breakdown
    if (checkins) {
      checkins.forEach(c => {
        if (c.mood) {
          moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1
        }
      })
    }

    // Current streak = count of checkins since last relapse
    // Using length instead of UTC date grouping to respect the user's local timezone
    if (checkins) {
      const sinceRelapse = checkins.filter(c => new Date(c.created_at) >= lastRelapseDate)
      currentStreak = sinceRelapse.length
    }

    // Longest streak calculation
    if (checkins && checkins.length > 0) {
      const allDates = [...new Set(checkins.map(c => new Date(c.created_at).toISOString().split('T')[0]))].sort()
      let streak = 1
      let maxStreak = 1
      for (let i = 1; i < allDates.length; i++) {
        const prev = new Date(allDates[i - 1])
        const curr = new Date(allDates[i])
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          streak++
          maxStreak = Math.max(maxStreak, streak)
        } else {
          streak = 1
        }
      }
      longestStreak = maxStreak
    }

    // Checkin calendar (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const calendarMap: Record<string, number> = {}
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo)
      d.setDate(d.getDate() + i)
      calendarMap[d.toISOString().split('T')[0]] = 0
    }
    if (checkins) {
      checkins.forEach(c => {
        const key = new Date(c.created_at).toISOString().split('T')[0]
        if (calendarMap[key] !== undefined) {
          calendarMap[key]++
        }
      })
    }
    checkinCalendar = Object.entries(calendarMap).map(([date, count]) => ({ date, count }))

    // Total journal entries
    const { data: journals, count: journalCount } = await supabase
      .from('journal_entries')
      .select('id, created_at, reflection', { count: 'exact' })
      .eq('user_id', user.id)
    totalJournalEntries = journalCount || 0

    // Urge logs
    const { data: urges } = await supabase
      .from('urge_logs')
      .select('intensity, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
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
          title: 'Relapse Logged',
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
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Progress Analytics</h1>
        <p className="text-muted text-lg">Visualize your journey. Every step is progress.</p>
      </header>

      {/* AI Coach */}
      <div className="mb-8">
        <AICoach isPremium={isPremium} />
      </div>

      {/* Predictive Warning */}
      <PredictiveWarning 
        isPremium={isPremium}
        currentStreak={currentStreak}
        totalRelapses={totalRelapses}
        averageStreak={averageStreak}
        lastUrgeIntensity={lastUrgeIntensity}
        lastUrgeTime={lastUrgeTime}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-muted">Current Streak</span>
          </div>
          <p className="text-4xl font-bold text-foreground tracking-tight">{currentStreak}</p>
          <p className="text-xs text-muted mt-1">days</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm font-semibold text-muted">Longest Streak</span>
          </div>
          <p className="text-4xl font-bold text-foreground tracking-tight">{longestStreak}</p>
          <p className="text-xs text-muted mt-1">days</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm font-semibold text-muted">Total Check-ins</span>
          </div>
          <p className="text-4xl font-bold text-foreground tracking-tight">{totalCheckins}</p>
          <p className="text-xs text-muted mt-1">logged</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-sm font-semibold text-muted">Total Relapses</span>
          </div>
          <p className="text-4xl font-bold text-foreground tracking-tight">{totalRelapses}</p>
          <p className="text-xs text-muted mt-1">logged</p>
        </div>
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <BookHeart className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-sm font-semibold text-muted">Journal Entries</span>
          </div>
          <p className="text-4xl font-bold text-foreground tracking-tight">{totalJournalEntries}</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm font-semibold text-muted">Urges Logged</span>
          </div>
          <p className="text-4xl font-bold text-foreground tracking-tight">{totalUrges}</p>
          {averageIntensity > 0 && (
            <p className="text-xs text-muted mt-1">Avg intensity: {averageIntensity}/10</p>
          )}
        </div>

        <div className="col-span-2 lg:col-span-1 bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <MoodBreakdownChart moodCounts={moodCounts} totalCheckins={totalCheckins} />
        </div>
      </div>

      {/* 30-Day Activity Heatmap */}
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-2 text-foreground">30-Day Check-in Activity</h3>
        <p className="text-sm text-muted mb-6">Your consistency over the past month.</p>
        <div className="grid grid-cols-10 gap-2">
          {checkinCalendar.map((day) => {
            const d = new Date(day.date + 'T00:00:00')
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return (
              <div key={day.date} className="group relative" title={`${label}: ${day.count} check-in(s)`}>
                <div className={`aspect-square rounded-lg transition-all ${
                  day.count > 0
                    ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                    : 'bg-surface-hover border border-border opacity-50'
                }`} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-3 mt-5 text-xs text-muted">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-surface-hover border border-border opacity-50" />
          <div className="w-3 h-3 rounded bg-primary" />
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
