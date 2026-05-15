export default function AccountabilityLoading() {
  return (
    <div className="animate-in fade-in duration-300 max-w-3xl">
      <div className="h-8 w-56 bg-surface-hover rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-64 bg-surface-hover rounded animate-pulse mb-8" />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="h-5 w-36 bg-surface-hover rounded animate-pulse mb-4" />
        <div className="h-4 w-full bg-surface-hover rounded animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-surface-hover rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
