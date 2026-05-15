import { createClient } from '@/utils/supabase/server'
import { LifeBuoy, BookHeart, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import UrgeLogger from './components/UrgeLogger'
import DailyCheckin from './components/DailyCheckin'
import UrgeIntensityChart from './components/UrgeIntensityChart'
import RelapseButton from './components/RelapseButton'
import AIInsightCard from './components/AIInsightCard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  let daysOfGrowth = 0
  let nextMilestone = 7
  let isPremium = false
  let totalUrges = 0
  let totalJournals = 0

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('users').select('subscription_tier').eq('id', user.id).single()
      isPremium = profile?.subscription_tier === 'premium'

      let startDate = new Date(user.created_at)
      
      const { data: relapses } = await supabase
        .from('relapses')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (relapses && relapses.length > 0) {
        startDate = new Date(relapses[0].created_at)
      }

      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())

      if (checkins) {
        // Because the client already enforces 1 check-in per user's local day,
        // we can safely rely on the length of checkins. Using UTC dates caused
        // check-ins at 12 AM local time to be grouped into the same UTC day.
        daysOfGrowth = checkins.length
      }

      const [{ count: urgeCount }, { count: journalCount }] = await Promise.all([
        supabase.from('urge_logs').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ])

      totalUrges = urgeCount || 0
      totalJournals = journalCount || 0
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('Dashboard data fetch failed:', e)
  }

  // Determine next milestone
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  nextMilestone = milestones.find(m => m > daysOfGrowth) || 365

  const badges = [
    { label: 'Consistency Starter', unlocked: daysOfGrowth >= 3 },
    { label: 'Steady Momentum', unlocked: daysOfGrowth >= 14 },
    { label: 'Reflection Builder', unlocked: totalJournals >= 5 },
    { label: 'Urge Observer', unlocked: totalUrges >= 10 },
  ]
  const unlockedBadges = badges.filter(badge => badge.unlocked).length

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted mt-1 text-lg">Every day is a step forward. Let&apos;s keep going.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/journal"
            className="flex items-center gap-2 bg-surface hover:bg-surface-hover text-foreground border border-border px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <BookHeart className="w-4 h-4 text-primary" />
            Journal
          </Link>
          <Link
            href="/dashboard/sos"
            className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <LifeBuoy className="w-4 h-4" />
            SOS
          </Link>
        </div>
      </header>

      <div className="mb-6 rounded-2xl border border-border bg-background/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted">Turn on daily reminders to stay consistent during high-risk windows.</p>
        <Link href="/dashboard/settings" className="text-sm font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1.5">
          Configure nudges <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Hero: Streak & Progress */}
      <section className="glass-card rounded-3xl p-7 md:p-10 text-center shadow-md mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-full bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Recovery momentum
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-primary mb-3 tracking-tighter">{daysOfGrowth}</h2>
          <p className="font-semibold text-xl tracking-wide">Days of Growth</p>
          <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
            You are building a new life, one day at a time. Lapses are just lessons, not failures.
          </p>

          <div className="w-full bg-border/40 rounded-full h-2 mt-10 max-w-2xl mx-auto overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((daysOfGrowth / nextMilestone) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted mt-4 font-semibold uppercase tracking-widest">
            Next Milestone: {nextMilestone} Days
          </p>

          <div className="mt-6 flex flex-wrap gap-3 items-center justify-center">
            <Link href="/dashboard/analytics" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-primary-hover transition-colors">
              View Insights <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/motivation" className="inline-flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-full text-sm font-bold hover:bg-surface-hover transition-colors">
              Stay Motivated
            </Link>
          </div>
          
          <RelapseButton />
        </div>
      </section>

      {/* Grid Layout for Tools & Analytics */}
      <section className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Progress Badges</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">{unlockedBadges}/{badges.length} unlocked</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div key={badge.label} className={`rounded-xl border p-4 ${badge.unlocked ? 'border-primary/40 bg-primary/10' : 'border-border bg-background/60'}`}>
              <p className="text-sm font-semibold text-foreground">{badge.label}</p>
              <p className="text-xs text-muted mt-1">{badge.unlocked ? 'Unlocked' : 'Keep going'}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Actions */}
        <div className="lg:col-span-5 space-y-8">
          <DailyCheckin />
          <UrgeLogger />
        </div>

        {/* Right Column: Analytics */}
        <div className="lg:col-span-7 space-y-8">
          <UrgeIntensityChart />
          
          {/* AI Insight — live for premium, upgrade prompt for free */}
          <AIInsightCard isPremium={isPremium} />
        </div>

      </div>
    </div>
  )
}
