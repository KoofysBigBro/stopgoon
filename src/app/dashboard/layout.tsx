import Link from 'next/link'
import { LayoutDashboard, BookHeart, LifeBuoy, Activity, Settings, LogOut, ShieldCheck, Users, MessageCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatNotificationDot from './components/ChatNotificationDot'
import DashboardAdWrapper from '@/components/DashboardAdWrapper'

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

  // Fetch user profile (username)
  const { data: profile } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single()

  const displayName = profile?.username || user.email?.split('@')[0] || user.email

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-border flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-4 md:p-6 flex flex-col md:block">
          <Link href="/dashboard" className="flex items-center gap-3 mb-4 md:mb-8 text-primary group w-fit">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-heading">StopGoon</span>
          </Link>

          <nav className="flex overflow-x-auto md:flex-col gap-2 md:gap-1 pb-2 md:pb-0 custom-scrollbar">
            <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Dashboard</span>
            </Link>
            <Link href="/dashboard/journal" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
              <BookHeart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Journal</span>
            </Link>
            <Link href="/dashboard/sos" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors font-medium whitespace-nowrap">
              <LifeBuoy className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">SOS Mode</span>
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Analytics</span>
            </Link>
            <Link href="/dashboard/accountability" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Partners</span>
            </Link>
            <Link href="/dashboard/motivation" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-amber-500/10 text-amber-500 transition-colors font-medium whitespace-nowrap">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Motivation</span>
            </Link>
            <Link href="/dashboard/chat" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground relative whitespace-nowrap">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Community</span>
              <ChatNotificationDot userId={user.id} />
            </Link>
            {/* Mobile-only settings & logout */}
            <Link href="/dashboard/settings" className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </Link>
            <form action={handleSignOut} className="md:hidden flex">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign out</span>
              </button>
            </form>
          </nav>
        </div>

        <div className="hidden md:block p-6 border-t border-border mt-auto">
          <div className="mb-4 truncate text-sm text-muted font-medium">
            {displayName}
          </div>
          <nav className="space-y-1 mb-3">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
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
        <DashboardAdWrapper />
        {children}
      </main>
    </div>
  )
}
