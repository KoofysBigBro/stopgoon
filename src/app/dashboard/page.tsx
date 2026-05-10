import { createClient } from '@/utils/supabase/server'
import { LifeBuoy, Zap, BookHeart } from 'lucide-react'
import Link from 'next/link'
import UrgeLogger from './components/UrgeLogger'
import DailyCheckin from './components/DailyCheckin'
import UrgeIntensityChart from './components/UrgeIntensityChart'
import RelapseButton from './components/RelapseButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Calculate days of growth from the most recent relapse
  let daysOfGrowth = 0
  let nextMilestone = 7

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
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
        // count unique days the user checked in
        const uniqueDays = new Set(
          checkins.map(c => new Date(c.created_at).toISOString().split('T')[0])
        )
        daysOfGrowth = uniqueDays.size
      }
    }
  } catch {
    // Tables might not exist yet
  }

  // Determine next milestone
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  nextMilestone = milestones.find(m => m > daysOfGrowth) || 365

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted mt-1 text-lg">Every day is a step forward. Let's keep going.</p>
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

      {/* Main Hero: Streak & Progress */}
      <section className="bg-surface border border-border rounded-3xl p-10 text-center shadow-md mb-8 relative overflow-hidden">
        {/* Soft glowing background effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-full bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10">
          <h2 className="text-7xl font-bold text-primary mb-3 tracking-tighter">{daysOfGrowth}</h2>
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
          
          <RelapseButton />
        </div>
      </section>

      {/* Grid Layout for Tools & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Actions */}
        <div className="lg:col-span-5 space-y-8">
          <DailyCheckin />
          <UrgeLogger />
        </div>

        {/* Right Column: Analytics */}
        <div className="lg:col-span-7 space-y-8">
          <UrgeIntensityChart />
          
          {/* We can add more widgets here later like 'Recent Insights' or 'Mood Trends' */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Recovery Insight</h4>
              <p className="text-sm text-muted mt-0.5">Most of your urges happen around 10 PM. Consider starting a wind-down routine at 9 PM.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
