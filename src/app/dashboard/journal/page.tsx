import { createClient } from '@/utils/supabase/server'

export default async function JournalPage() {
  const supabase = await createClient()
  
  // In a real app, fetch entries:
  // const { data: entries } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false })
  const entries: any[] = [] // mock

  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Recovery Journal</h1>
        <p className="text-slate-500 dark:text-slate-400">Reflect on your journey. Honesty with yourself is the key to growth.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* New Entry Form */}
        <section className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="text-xl font-bold mb-6">New Entry</h3>
            
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">What are you logging?</label>
                <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="reflection">General Reflection</option>
                  <option value="gratitude">Gratitude</option>
                  <option value="relapse">Relapse Reflection (Why did it happen?)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Thoughts</label>
                <textarea 
                  rows={6}
                  placeholder="Write what&apos;s on your mind..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors mt-2">
                Save Entry
              </button>
            </form>
          </div>
        </section>

        {/* Past Entries */}
        <section className="lg:col-span-7">
          <h3 className="text-xl font-bold mb-6">Past Entries</h3>
          
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">No entries yet. Start by logging your thoughts on the left.</p>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                      {entry.type}
                    </span>
                    <span className="text-sm text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{entry.content}</p>
                </div>
              ))
            )}
            
            {/* Mock entry for display */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-3 border-l-4 border-l-indigo-500">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  REFLECTION
                </span>
                <span className="text-sm text-slate-400">Just now</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Today was a good day. I had a small urge but I used the SOS breathing tool and it passed. Feeling proud of the progress I&apos;m making.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
