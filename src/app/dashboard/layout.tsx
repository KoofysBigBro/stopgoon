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
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-border flex flex-col justify-between sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 mb-8 text-primary group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-heading">Reclaim</span>
          </Link>

          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/dashboard/journal" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <BookHeart className="w-5 h-5" />
              Journal
            </Link>
            <Link href="/dashboard/sos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors font-medium">
              <LifeBuoy className="w-5 h-5" />
              SOS Mode
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Activity className="w-5 h-5" />
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-border">
          <div className="mb-4 truncate text-sm text-muted font-medium">
            {user.email}
          </div>
          <form action={handleSignOut}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <LogOut className="w-5 h-5" />
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
