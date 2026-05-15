export default function ReviewLoading() {
  return (
    <div className="animate-in fade-in duration-300 max-w-3xl">
      <div className="h-8 w-48 bg-surface-hover rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-72 bg-surface-hover rounded animate-pulse mb-8" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="h-4 w-20 bg-surface-hover rounded animate-pulse mb-3" />
            <div className="h-8 w-16 bg-surface-hover rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="h-5 w-40 bg-surface-hover rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-surface-hover rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
