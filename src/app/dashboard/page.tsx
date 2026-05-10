import { createClient } from '@/utils/supabase/server'
import { LifeBuoy } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch real data from supabase in the future
  // For now, we mock the stats to match the design requested
  const daysOfGrowth = 0; // Fresh start

  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Recovery is a journey, not a race. You&apos;re doing great.</p>
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
            Every day is a step forward. Lapses are lessons, not resets. Build your foundation one block at a time.
          </p>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mt-8 overflow-hidden max-w-2xl mx-auto">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min((daysOfGrowth / 30) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-medium uppercase tracking-wider">Next Milestone: 30 Days</p>
        </section>

        {/* Daily Check-in (Client component normally, but keeping it simple server component for UI demo) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Daily Check-in</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">How are you feeling today?</p>
          
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 font-medium transition-all">
              Great
            </button>
            <button className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-medium transition-all">
              Okay
            </button>
            <button className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 dark:text-slate-300 font-medium transition-all">
              Struggling
            </button>
          </div>
        </section>

        {/* Urge Logger */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Log an Urge</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Acknowledge it, let it pass.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Intensity (1-10)</label>
              <input type="range" min="1" max="10" defaultValue="5" className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-white transition-colors">
            Log Urge & Let Go
          </button>
        </section>
      </div>
    </div>
  )
}
