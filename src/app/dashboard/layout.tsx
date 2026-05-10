import Link from 'next/link'
import { LayoutDashboard, BookHeart, LifeBuoy, Activity, Settings, LogOut, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabaseServer = await createClient()
    await supabaseServer.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StopGoon</span>
          </Link>

          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <LayoutDashboard className="w-5 h-5 text-slate-500" />
              Dashboard
            </Link>
            <Link href="/dashboard/journal" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <BookHeart className="w-5 h-5 text-slate-500" />
              Journal
            </Link>
            <Link href="/dashboard/sos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors font-medium">
              <LifeBuoy className="w-5 h-5" />
              SOS Mode
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Activity className="w-5 h-5 text-slate-500" />
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Settings className="w-5 h-5 text-slate-500" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-4 truncate text-sm text-slate-500 dark:text-slate-400">
            {user.email}
          </div>
          <form action={handleSignOut}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <LogOut className="w-5 h-5 text-slate-500" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
