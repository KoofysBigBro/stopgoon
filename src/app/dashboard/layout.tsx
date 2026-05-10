import Link from 'next/link'
import { LayoutDashboard, BookHeart, LifeBuoy, Activity, Settings, LogOut, ShieldCheck, Users, MessageCircle } from 'lucide-react'
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

  // Fetch user profile (username + last_seen_chat_at)
  const { data: profile } = await supabase
    .from('users')
    .select('username, last_seen_chat_at')
    .eq('id', user.id)
    .single()

  const displayName = profile?.username || user.email?.split('@')[0] || user.email

  // Check for unread chat messages since last visit
  const lastSeen = profile?.last_seen_chat_at || '2000-01-01T00:00:00Z'
  const { count: unreadCount } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', 'global')
    .neq('user_id', user.id)
    .gt('created_at', lastSeen)

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-border flex flex-col justify-between sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 mb-8 text-primary group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-heading">StopGoon</span>
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
            <Link href="/dashboard/accountability" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Users className="w-5 h-5" />
              Partners
            </Link>
            <Link href="/dashboard/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground relative">
              <MessageCircle className="w-5 h-5" />
              Community
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </Link>

          </nav>
        </div>

        <div className="p-6 border-t border-border">
          <div className="mb-4 truncate text-sm text-muted font-medium">
            {displayName}
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
