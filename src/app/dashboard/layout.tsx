import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, BookHeart, LifeBuoy, Activity, Settings, LogOut, MessageCircle, Sparkles, BookOpen, Crown, Mail } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatNotificationDot from './components/ChatNotificationDot'
import CrisisShortcut from './components/CrisisShortcut'
import CommandPalette from './components/CommandPalette'

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

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('username, subscription_tier')
    .eq('id', user.id)
    .single()

  const displayName = profile?.username || user.email?.split('@')[0] || user.email
  const isPremium = profile?.subscription_tier === 'premium'

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-accent/15 blur-[100px]" />
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-surface/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-border flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-4 md:p-6 flex flex-col md:block">
          <Link href="/dashboard" className="flex items-center gap-3 mb-4 md:mb-8 text-primary group w-fit transition-transform hover:translate-x-0.5">
            <div className="bg-primary/10 p-1.5 rounded-xl group-hover:scale-105 transition-transform">
              <Image src="/icon.svg" alt="StopGoon logo" width={24} height={24} className="rounded-md" priority />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-heading">StopGoon</span>
          </Link>

          <div className="relative md:hidden">
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent z-10" />
            <nav className="flex overflow-x-auto md:flex-col gap-2 md:gap-1 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory md:snap-none [-webkit-overflow-scrolling:touch] scroll-pl-4 md:scroll-pl-0">
              {[
                { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', cls: '', dot: false },
                { href: '/dashboard/journal', icon: BookHeart, label: 'Journal', cls: '', dot: false },
                { href: '/dashboard/sos', icon: LifeBuoy, label: 'SOS Mode', cls: 'text-red-500 hover:bg-red-500/10', dot: false },
                { href: '/dashboard/analytics', icon: Activity, label: 'Analytics', cls: '', dot: false },
                { href: '/dashboard/motivation', icon: Sparkles, label: 'Motivation', cls: 'text-amber-500 hover:bg-amber-500/10', dot: false },
                { href: '/dashboard/chat', icon: MessageCircle, label: 'Community', cls: '', dot: true },
                { href: '/blog', icon: BookOpen, label: 'Blog', cls: '', dot: false },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`snap-start shrink-0 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-surface-hover transition-all duration-200 font-medium text-muted hover:text-foreground hover:translate-x-1 ${item.cls}`}
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{item.label}</span>
                  {item.dot && <ChatNotificationDot userId={user.id} />}
                </Link>
              ))}
              {isPremium ? (
                <div className="snap-start shrink-0 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 font-bold text-primary whitespace-nowrap">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">Premium</span>
                </div>
              ) : (
                <Link href="/dashboard/upgrade" className="snap-start shrink-0 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 font-bold text-primary whitespace-nowrap">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">Premium</span>
                </Link>
              )}
              <Link href="/dashboard/settings" className="snap-start shrink-0 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=stopgoonsupport@gmail.com" target="_blank" rel="noopener noreferrer" className="snap-start shrink-0 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Contact Support</span>
            </a>
              <form action={handleSignOut} className="snap-start shrink-0 md:hidden flex">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground whitespace-nowrap">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </form>
            </nav>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex flex-col gap-1 pb-0">
            <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted/50">Core</p>
            {[
              { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', cls: '', dot: false },
              { href: '/dashboard/journal', icon: BookHeart, label: 'Journal', cls: '', dot: false },
              { href: '/dashboard/sos', icon: LifeBuoy, label: 'SOS Mode', cls: 'text-red-500 hover:bg-red-500/10', dot: false },
              { href: '/dashboard/analytics', icon: Activity, label: 'Analytics', cls: '', dot: false },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-all duration-200 font-medium text-muted hover:text-foreground hover:translate-x-1 ${item.cls}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-base">{item.label}</span>
                {item.dot && <ChatNotificationDot userId={user.id} />}
              </Link>
            ))}
            <div className="my-1 mx-4 border-t border-border/50" />
            <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted/50">Support</p>
            {[
              { href: '/dashboard/motivation', icon: Sparkles, label: 'Motivation', cls: 'text-amber-500 hover:bg-amber-500/10', dot: false },
              { href: '/dashboard/chat', icon: MessageCircle, label: 'Community', cls: '', dot: true },
              { href: '/blog', icon: BookOpen, label: 'Blog', cls: '', dot: false },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-all duration-200 font-medium text-muted hover:text-foreground hover:translate-x-1 ${item.cls}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-base">{item.label}</span>
                {item.dot && <ChatNotificationDot userId={user.id} />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:block p-6 border-t border-border mt-auto">
          {!isPremium ? (
            <Link
              href="/dashboard/upgrade"
              className="flex items-center gap-3 w-full px-4 py-3 mb-3 rounded-xl bg-gradient-to-r from-primary/20 via-indigo-500/20 to-primary/20 border border-primary/30 hover:border-primary/60 transition-all font-bold text-sm text-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </Link>
          ) : (
            <div className="flex items-center gap-3 w-full px-4 py-3 mb-3 rounded-xl bg-primary/10 border border-primary/30 font-bold text-sm text-primary">
              <Crown className="w-5 h-5" />
              Premium
            </div>
          )}
          <div className="mb-4 truncate text-sm text-muted font-medium">
            {displayName}
          </div>
          <nav className="space-y-1 mb-3">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=stopgoonsupport@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Mail className="w-5 h-5 shrink-0" />
              <span className="text-sm">Contact Support</span>
            </a>
            <div className="px-4 text-[10px] text-muted/50 truncate">stopgoonsupport@gmail.com</div>
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
      <main className="flex-1 p-6 md:p-12 max-w-5xl overflow-y-auto relative z-10 animate-fade-up">
        {children}
      </main>
      <CommandPalette />
      <CrisisShortcut />
    </div>
  )
}
