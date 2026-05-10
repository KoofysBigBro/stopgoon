import { createClient } from '@/utils/supabase/server'
import { LifeBuoy } from 'lucide-react'
import Link from 'next/link'
import UrgeLogger from './components/UrgeLogger'
import DailyCheckin from './components/DailyCheckin'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Calculate days of growth from the most recent relapse
  let daysOfGrowth = 0
  let nextMilestone = 7

  try {
    const { data: relapses } = await supabase
      .from('relapses')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)

    if (relapses && relapses.length > 0) {
      const lastRelapse = new Date(relapses[0].created_at)
      const now = new Date()
      daysOfGrowth = Math.floor((now.getTime() - lastRelapse.getTime()) / (1000 * 60 * 60 * 24))
    } else {
      // No relapses logged — calculate from account creation
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const created = new Date(user.created_at)
        const now = new Date()
        daysOfGrowth = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      }
    }
  } catch {
    // Tables might not exist yet
  }

  // Determine next milestone
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  nextMilestone = milestones.find(m => m > daysOfGrowth) || 365

  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Recovery is a journey, not a race.</p>
        </div>
        <Link
          href="/dashboard/sos"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-red-600/20"
        >
          <LifeBuoy className="w-5 h-5" />
          Emergency SOS
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestone Tracker */}
        <section className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{daysOfGrowth}</h2>
          <p className="font-semibold text-lg">Days of Growth</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Every day is a step forward. Lapses are lessons, not failures.
          </p>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mt-8 overflow-hidden max-w-2xl mx-auto">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((daysOfGrowth / nextMilestone) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-medium uppercase tracking-wider">
            Next Milestone: {nextMilestone} Days
          </p>
        </section>

        {/* Daily Check-in */}
        <DailyCheckin />

        {/* Urge Logger */}
        <UrgeLogger />
      </div>
    </div>
  )
}
