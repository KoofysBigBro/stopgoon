import { Palette, Accessibility, Database, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings & Preferences</h1>
        <p className="text-slate-500 dark:text-slate-400">Customize your experience to make it comfortable for you.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 max-w-3xl">
        {/* Subscription (SaaS Feature) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Subscription</h2>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-5 mb-6 flex justify-between items-center">
            <div>
              <p className="font-bold text-indigo-900 dark:text-indigo-100">Free Tier</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">Basic tracking and journaling.</p>
            </div>
            <span className="px-3 py-1 bg-white dark:bg-slate-800 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-700">Active</span>
          </div>

          <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Upgrade to Premium
          </button>
        </section>

        {/* Theme */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Theme Customization</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Visual Theme</label>
            <select className="w-full sm:w-1/2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="calm">Calm Minimalist (Light)</option>
              <option value="midnight">Midnight Recovery (Dark)</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">More themes available in Premium.</p>
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Accessibility className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Accessibility</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Text Size</label>
              <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="normal">Normal (16px)</option>
                <option value="large">Large (18px)</option>
                <option value="xlarge">Extra Large (20px)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Animations & Motion</label>
              <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="normal">Normal</option>
                <option value="reduced">Reduced Motion</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Data & Privacy</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Your data is synced securely to the cloud. You can export a local copy at any time.</p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-6 py-2.5 rounded-lg font-medium transition-colors">
              Export Data
            </button>
            <button className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-6 py-2.5 rounded-lg font-medium transition-colors border border-red-200 dark:border-red-800/50">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
