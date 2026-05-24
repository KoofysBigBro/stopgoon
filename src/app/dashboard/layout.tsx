import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, BookHeart, LifeBuoy, Activity, Settings, LogOut, MessageCircle, Sparkles, BookOpen, Crown, Mail } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatNotificationDot from './components/ChatNotificationDot'
import AdBanner from '@/components/AdBanner'



function NavLink({ href, icon: Icon, label, cls, dot, userId }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; cls: string; dot: boolean; userId: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-all duration-200 font-medium text-muted hover:text-foreground hover:translate-x-1 ${cls}`}>
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="text-base">{label}</span>
      {dot && <ChatNotificationDot userId={userId} />}
    </Link>
  )
}

function PremiumBadgeMobile({ isPremium }: { isPremium: boolean }) {
  if (isPremium) {
    return (
      <div className="snap-start shrink-0 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 font-bold text-primary whitespace-nowrap">
        <Crown className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm">Premium</span>
      </div>
    )
  }
  return (
    <Link href="/dashboard/upgrade" className="snap-start shrink-0 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 font-bold text-primary whitespace-nowrap">
      <Crown className="w-4 h-4" aria-hidden="true" />
      <span className="text-sm">Premium</span>
    </Link>
  )
}

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

  // Calculate current streak for global top-right badge
  const { data: relapses } = await supabase.from('relapses').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
  const startDate = relapses && relapses.length > 0 ? new Date(relapses[0].created_at) : new Date(user.created_at)
  const { data: checkins } = await supabase.from('daily_checkins').select('id').eq('user_id', user.id).gte('created_at', startDate.toISOString())
  const currentStreak = checkins?.length || 0

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-accent/15 blur-[100px]" />
      {/* Sidebar / Topbar */}
      <aside aria-label="Sidebar navigation" className="hidden md:flex w-64 bg-surface/90 backdrop-blur-md border-r border-border flex-col sticky top-0 h-screen z-40">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center mb-10 w-fit group select-none">
            <div className="flex flex-col items-start leading-[0.8] font-black tracking-tighter transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-[26px] text-muted-foreground/80 drop-shadow-md">STOP</span>
              <span className="text-[34px] text-primary/90 drop-shadow-[0_2px_15px_rgba(139,92,246,0.3)] -mt-1">GOON</span>
            </div>
          </Link>

          {(() => {
            const coreNav = [
              { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', cls: '', dot: false },
              { href: '/dashboard/journal', icon: BookHeart, label: 'Journal', cls: '', dot: false },
              { href: '/dashboard/sos', icon: LifeBuoy, label: 'SOS Mode', cls: 'text-red-500 hover:bg-red-500/10', dot: false },
              { href: '/dashboard/analytics', icon: Activity, label: 'Analytics', cls: '', dot: false },
            ] as const
            const supportNav = [
              { href: '/dashboard/motivation', icon: Sparkles, label: 'Motivation', cls: 'text-amber-500 hover:bg-amber-500/10', dot: false },
              { href: '/dashboard/chat', icon: MessageCircle, label: 'Community', cls: '', dot: true },
              { href: '/blog', icon: BookOpen, label: 'Blog', cls: '', dot: false },
            ] as const
            return (
              <>
                {/* Desktop vertical nav */}
                <nav aria-label="Main dashboard navigation" className="flex flex-col gap-1 pb-0">
                  <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted/50">Core</p>
                  {coreNav.map(item => (
                    <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} cls={item.cls} dot={item.dot} userId={user.id} />
                  ))}
                  <div className="my-1 mx-4 border-t border-border/50" />
                  <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted/50">Support</p>
                  {supportNav.map(item => (
                    <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} cls={item.cls} dot={item.dot} userId={user.id} />
                  ))}
                </nav>
              </>
            )
          })()}
        </div>

        <div className="p-6 border-t border-border mt-auto">
          {!isPremium ? (
            <Link
              href="/dashboard/upgrade"
              className="flex items-center gap-3 w-full px-4 py-3 mb-3 rounded-xl bg-gradient-to-r from-primary/20 via-indigo-500/20 to-primary/20 border border-primary/30 hover:border-primary/60 transition-all font-bold text-sm text-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <Crown className="w-5 h-5" aria-hidden="true" />
              Upgrade to Premium
            </Link>
          ) : (
            <div className="flex items-center gap-3 w-full px-4 py-3 mb-3 rounded-xl bg-primary/10 border border-primary/30 font-bold text-sm text-primary">
              <Crown className="w-5 h-5" aria-hidden="true" />
              Premium
            </div>
          )}
          <div className="mb-4 truncate text-sm text-muted font-medium">
            {displayName}
          </div>
          <nav className="space-y-1 mb-3">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Settings className="w-5 h-5" aria-hidden="true" />
              Settings
            </Link>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=stopgoonsupport@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-sm">Contact Support</span>
            </a>
            <div className="px-4 text-[10px] text-muted/50 truncate">stopgoonsupport@gmail.com</div>
          </nav>
          <form action={handleSignOut}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl hover:bg-surface-hover transition-colors font-medium text-muted hover:text-foreground">
              <LogOut className="w-5 h-5" aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-border/50">
        <nav aria-label="Mobile navigation" className="flex overflow-x-auto items-center gap-7 px-6 py-4 scrollbar-none snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
          {[
            { href: '/dashboard', icon: LayoutDashboard },
            { href: '/dashboard/journal', icon: BookHeart },
            { href: '/dashboard/sos', icon: LifeBuoy, cls: 'text-red-500' },
            { href: '/dashboard/analytics', icon: Activity },
            { href: '/dashboard/motivation', icon: Sparkles, cls: 'text-amber-500' },
            { href: '/dashboard/chat', icon: MessageCircle, dot: true },
            { href: '/blog', icon: BookOpen },
          ].map((item, i) => (
            <Link key={item.href} href={item.href} aria-label={item.href === '/dashboard' ? 'Dashboard' : item.href === '/dashboard/journal' ? 'Journal' : item.href === '/dashboard/sos' ? 'SOS Mode' : item.href === '/dashboard/analytics' ? 'Analytics' : item.href === '/dashboard/motivation' ? 'Motivation' : item.href === '/dashboard/chat' ? 'Community' : 'Blog'} className={`snap-start shrink-0 flex flex-col items-center justify-center gap-1 group relative transition-transform active:scale-95 ${item.cls || ''}`}>
              <item.icon className="w-6 h-6 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
              {item.dot && <div className="absolute -top-1 -right-1"><ChatNotificationDot userId={user.id} /></div>}
            </Link>
          ))}
          {isPremium ? (
             <div className="snap-start shrink-0 flex items-center justify-center p-1 rounded-full bg-primary/10 border border-primary/20">
               <Crown className="w-5 h-5 text-primary" aria-hidden="true" />
             </div>
          ) : (
             <Link href="/dashboard/upgrade" aria-label="Upgrade to Premium" className="snap-start shrink-0 flex items-center justify-center p-1 rounded-full bg-primary/10 border border-primary/20 transition-transform active:scale-95">
               <Crown className="w-5 h-5 text-primary" aria-hidden="true" />
             </Link>
          )}
          <Link href="/dashboard/settings" aria-label="Settings" className="snap-start shrink-0 flex items-center justify-center group transition-transform active:scale-95">
            <Settings className="w-6 h-6 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
          </Link>
          <form action={handleSignOut} className="snap-start shrink-0 flex">
            <button aria-label="Sign out" className="flex items-center justify-center group transition-transform active:scale-95">
              <LogOut className="w-6 h-6 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
            </button>
          </form>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 md:p-12 md:pb-12 max-w-5xl overflow-y-auto relative z-10 animate-fade-up">
        {/* Top Header Mobile / Badges */}
        <div className="absolute top-4 left-4 right-4 md:top-8 md:right-8 md:left-auto flex items-center justify-between md:justify-end z-50 pointer-events-none">
          {/* Streak Badge (Top Left Mobile, Top Right Desktop) */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#2a2a2a] rounded-full shadow-lg pointer-events-auto">
            <span className="text-orange-500 text-sm drop-shadow-md">🔥</span>
            <span className="text-sm font-bold text-[#b0b0b0] tracking-wide">{currentStreak}</span>
          </div>
          
          {/* Mobile Logo (Top Right) */}
          <Link href="/dashboard" className="md:hidden flex flex-col items-end leading-[0.8] font-black tracking-tighter select-none pointer-events-auto">
            <span className="text-[18px] text-muted-foreground/80 drop-shadow-md">STOP</span>
            <span className="text-[24px] text-primary/90 drop-shadow-[0_2px_15px_rgba(139,92,246,0.3)] -mt-1">GOON</span>
          </Link>
        </div>
        {children}

        {/* Mobile Ad Banner */}
        {!isPremium && (
          <div className="block lg:hidden mt-8">
             <AdBanner isPremium={isPremium} slot="mobile-bottom" format="rectangle" />
          </div>
        )}
      </main>

      {/* Right Ad Sidebar (Desktop) */}
      {!isPremium && (
        <aside className="hidden lg:flex w-72 p-6 flex-col border-l border-border/40 bg-surface/30 sticky top-0 h-screen overflow-y-auto z-40">
          <div className="sticky top-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted/50 mb-3 px-1">Sponsor</p>
            <AdBanner isPremium={isPremium} slot="desktop-sidebar" format="vertical" />
          </div>
        </aside>
      )}
    </div>
  )
}
