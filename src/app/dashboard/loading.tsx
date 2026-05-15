export default function DashboardLoading() {
  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="h-9 w-64 bg-border/50 rounded-lg animate-pulse mb-2" />
        <div className="h-5 w-80 bg-border/40 rounded-lg animate-pulse" />
      </div>

      <div className="glass-card rounded-3xl p-10 text-center mb-8">
        <div className="h-20 w-20 bg-border/40 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-16 w-32 bg-border/40 rounded-lg animate-pulse mx-auto mb-3" />
        <div className="h-5 w-48 bg-border/40 rounded-lg animate-pulse mx-auto" />
      </div>

      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="h-5 w-36 bg-border/50 rounded-lg animate-pulse mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="h-4 w-28 bg-border/40 rounded animate-pulse mb-2" />
              <div className="h-3 w-16 bg-border/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <div className="h-64 bg-border/30 rounded-2xl animate-pulse" />
          <div className="h-64 bg-border/30 rounded-2xl animate-pulse" />
        </div>
        <div className="lg:col-span-7 space-y-8">
          <div className="h-64 bg-border/30 rounded-2xl animate-pulse" />
          <div className="h-64 bg-border/30 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
