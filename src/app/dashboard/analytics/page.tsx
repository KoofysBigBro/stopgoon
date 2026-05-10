export default function AnalyticsPage() {
  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Progress Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Visualize your journey. Every step is progress.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold mb-2">Current Milestone</h3>
          <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 my-4">0 Days</p>
          <p className="text-slate-500 dark:text-slate-400">Keep going!</p>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold mb-2">Total Check-ins</h3>
          <p className="text-5xl font-bold text-emerald-500 my-4">1</p>
          <p className="text-slate-500 dark:text-slate-400">Journal & Urge Logs</p>
        </section>

        <section className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Insights</h3>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
            <p className="font-medium">You haven't logged any lapses. Amazing work building your foundation!</p>
            
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 className="font-bold mb-2 text-slate-700 dark:text-slate-300">Common Patterns</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                (Pattern analysis will populate here as you log more specific urge intensities and moods in your journal over time).
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
