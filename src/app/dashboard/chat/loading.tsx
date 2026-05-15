export default function ChatLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="h-8 w-32 bg-surface-hover rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-56 bg-surface-hover rounded animate-pulse mb-6" />

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col">
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <div className={`h-12 ${i % 2 === 0 ? 'w-48' : 'w-64'} bg-surface-hover rounded-2xl animate-pulse`} />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="h-12 bg-surface-hover rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
