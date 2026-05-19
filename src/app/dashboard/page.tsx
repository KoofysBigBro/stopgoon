import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Activity, BookHeart, Sparkles, LifeBuoy } from 'lucide-react'
import DailyCheckin from './components/DailyCheckin'
import UrgeLogger from './components/UrgeLogger'
import RelapseButton from './components/RelapseButton'
import AIInsightCard from './components/AIInsightCard'

export const dynamic = 'force-dynamic'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = await createClient()

  let daysOfGrowth = 0
  let nextMilestone = 7
  let isPremium = false

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
        daysOfGrowth = checkins.length
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('Dashboard data fetch failed:', e)
  }

  // Determine next milestone
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  nextMilestone = milestones.find(m => m > daysOfGrowth) || 365

  const progress = Math.min((daysOfGrowth / nextMilestone) * 100, 100)

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      
      {/* Hero — the single most important thing */}
      <section className="text-center pt-4 pb-10 md:pt-8 md:pb-14 relative">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/12 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-40 h-40 md:w-52 md:h-52 rounded-full bg-primary/8 blur-[60px] pointer-events-none animate-glow-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="relative z-10">
          <p className="text-sm text-muted font-medium mb-10 md:mb-12">{getGreeting()}</p>
          
          <div className="mb-8">
            <p className="text-8xl md:text-9xl font-bold tracking-tighter text-foreground leading-none">{daysOfGrowth}</p>
            <p className="text-lg text-muted font-medium mt-2 tracking-wide">days</p>
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mb-3">
            <div className="w-full bg-border/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted/70 font-medium">
            Next milestone · {nextMilestone} days
          </p>

          {/* Primary + Secondary CTA */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <DailyCheckin />
            <Link
              href="/dashboard/sos"
              className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              <LifeBuoy className="w-4 h-4" />
              SOS
            </Link>
          </div>

          <RelapseButton />
        </div>
      </section>

      {/* Below-fold content — clean vertical stack */}
      <div className="space-y-5">
        
        {/* Urge Logger — simplified */}
        <UrgeLogger />

        {/* AI Insight — premium feature */}
        <AIInsightCard isPremium={isPremium} />

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/dashboard/analytics"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/70 hover:border-border/60 transition-all group"
          >
            <Activity className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-muted group-hover:text-foreground transition-colors">Analytics</span>
          </Link>
          <Link
            href="/dashboard/journal"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/70 hover:border-border/60 transition-all group"
          >
            <BookHeart className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-muted group-hover:text-foreground transition-colors">Journal</span>
          </Link>
          <Link
            href="/dashboard/motivation"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/70 hover:border-border/60 transition-all group"
          >
            <Sparkles className="w-5 h-5 text-muted group-hover:text-amber-400 transition-colors" />
            <span className="text-xs font-semibold text-muted group-hover:text-foreground transition-colors">Motivation</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
