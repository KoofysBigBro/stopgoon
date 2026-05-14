import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Flame, NotebookPen, Zap } from 'lucide-react'
import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

export default async function WeeklyReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let checkins = 0
  let urges = 0
  let journals = 0
  let avgIntensity = 0

  if (user) {
    const start = new Date()
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const { data: relapseRows } = await supabase
      .from('relapses')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    const lastRelapseDate = relapseRows && relapseRows.length > 0 ? new Date(relapseRows[0].created_at) : new Date(0)
    const rangeStart = new Date(Math.max(start.getTime(), lastRelapseDate.getTime()))

    const [{ data: checkinRows }, { data: urgeRows }, { count: journalCount }] = await Promise.all([
      supabase.from('daily_checkins').select('created_at').eq('user_id', user.id).gte('created_at', rangeStart.toISOString()),
      supabase.from('urge_logs').select('intensity').eq('user_id', user.id).gte('created_at', rangeStart.toISOString()),
      supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', rangeStart.toISOString()),
    ])

    checkins = checkinRows ? new Set(checkinRows.map((row) => row.created_at.slice(0, 10))).size : 0
    urges = urgeRows?.length || 0
    journals = journalCount || 0
    if (urgeRows && urgeRows.length > 0) {
      const total = urgeRows.reduce((acc, row) => acc + (row.intensity || 0), 0)
      avgIntensity = Math.round((total / urgeRows.length) * 10) / 10
    }
  }

  const consistency = Math.round((checkins / 7) * 100)

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Weekly Review</h1>
        <p className="text-muted mt-1">A calm summary of your last 7 days and your best next move.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card icon={<Flame className="w-5 h-5 text-primary" />} label="Check-ins" value={`${checkins}/7`} />
        <Card icon={<Zap className="w-5 h-5 text-accent" />} label="Urges logged" value={`${urges}`} />
        <Card icon={<NotebookPen className="w-5 h-5 text-emerald-500" />} label="Journal entries" value={`${journals}`} />
        <Card icon={<CheckCircle2 className="w-5 h-5 text-primary" />} label="Avg urge intensity" value={avgIntensity > 0 ? `${avgIntensity}/10` : 'No data'} />
      </div>

      <section className="glass-card rounded-2xl p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted font-bold mb-2">This week insight</p>
        <h2 className="text-xl font-bold mb-2">Consistency score: {consistency}%</h2>
        <p className="text-muted">{consistency >= 70 ? 'Strong consistency. Protect momentum with one daily check-in and a quick review.' : 'Build momentum by anchoring one tiny daily action: check-in + 1 line journal.'}</p>
      </section>

      <section className="glass-card rounded-2xl p-6">
        <p className="text-xs uppercase tracking-widest text-muted font-bold mb-3">Next week plan</p>
        <div className="space-y-2 text-sm">
          <p className="text-foreground">1. Do a daily 2-minute check-in before your highest risk hour.</p>
          <p className="text-foreground">2. Use SOS mode at first urge spike instead of waiting.</p>
          <p className="text-foreground">3. Share one progress ping with your accountability partner.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/sos" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors">
            Open SOS <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/accountability" className="inline-flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-xl font-bold hover:bg-surface-hover transition-colors">
            Send Partner Ping
          </Link>
        </div>
      </section>
    </div>
  )
}

function Card({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs font-bold uppercase tracking-wider text-muted">{label}</span></div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
