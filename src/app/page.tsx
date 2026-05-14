import Link from 'next/link'
import { ShieldCheck, Lock, TrendingDown, ArrowRight, CheckCircle2, Sparkles, Activity, HeartPulse, Zap, Compass, Users, BadgeCheck, Crown, Star } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getVariant } from '@/utils/experiments'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const heroVariant = await getVariant('home_hero', ['focus', 'freedom'] as const, 'focus')

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <nav className="border-b border-border/40 bg-background/70 backdrop-blur-xl fixed top-0 w-full z-50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-foreground">
            <div className="bg-primary/15 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" transitionTypes={['nav-forward']} className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/register" transitionTypes={['nav-forward']} className="text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute -top-36 left-0 w-[420px] h-[420px] bg-primary/25 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-32 -right-12 w-[320px] h-[320px] bg-accent/20 blur-[85px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-semibold mb-8 text-muted animate-fade-up">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Fresh recovery system for modern habits</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] font-heading animate-fade-up-delay">
            {heroVariant === 'freedom'
              ? 'Break compulsive loops and get your life force back.'
              : 'Build calm focus in a world designed to hijack your attention.'}
          </h1>

          <p className="text-lg md:text-xl text-muted mb-10 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-up-delay">
            StopGoon gives users a cleaner path to change: private check-ins, behavior insights, and in-the-moment rescue tools that feel empowering, not punishing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" transitionTypes={['nav-forward']} className="w-full sm:w-auto inline-flex items-center justify-center bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl">
              Start Your Recovery
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-sm text-muted mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-muted">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Encrypted by default</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Built for retention</span>
            <span className="px-3 py-1 rounded-full bg-accent/15 text-foreground">No shame-based streak language</span>
          </div>

          <div className="mt-20 relative mx-auto w-full max-w-4xl animate-float-slow">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/25 to-transparent rounded-2xl blur-lg opacity-80" />
            <div className="relative glass-card rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="h-12 border-b border-border bg-background/40 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-primary/80" />
              </div>
              <div className="p-8 grid grid-cols-3 gap-6 opacity-80 pointer-events-none">
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-48 bg-slate-300/70 dark:bg-slate-700/70 rounded-lg" />
                  <div className="h-32 w-full bg-surface-hover rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 w-full bg-surface-hover rounded-xl" />
                    <div className="h-24 w-full bg-surface-hover rounded-xl" />
                  </div>
                </div>
                <div className="col-span-1 space-y-4">
                  <div className="h-64 w-full bg-primary/15 border border-primary/30 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-14">
          <div className="max-w-6xl mx-auto glass-card rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm md:text-base font-semibold text-foreground text-center md:text-left">Users stick with StopGoon because it feels supportive, fast, and private.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-bold text-muted">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">2-min daily flow</span>
              <span className="px-3 py-1 rounded-full bg-accent/15 text-foreground">No shame language</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Private by design</span>
            </div>
          </div>
        </section>

        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['2 min', 'Daily flow'],
              ['7 days', 'First milestone'],
              ['Private', 'By design'],
              ['Zero ads', 'Premium mode']
            ].map(([k, v]) => (
              <div key={k} className="glass-card rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-foreground">{k}</p>
                <p className="text-xs text-muted font-semibold uppercase tracking-wider">{v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 bg-surface border-y border-border px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading tracking-tight">
                Why shame-based streaks fail your users.
              </h2>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                Most habit apps punish slips with emotional debt. That creates churn, guilt, and all-or-nothing behavior.
              </p>
              <p className="text-foreground font-medium text-lg mb-8 leading-relaxed">
                StopGoon treats relapses as <span className="text-primary">intelligence events</span>, not failures, then turns them into better predictions.
              </p>
              <ul className="space-y-4">
                {[
                  "Live risk trend detection",
                  "Trigger and context mapping",
                  "Proactive intervention prompts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-primary/10 absolute -inset-10 blur-3xl -z-10" />
              <div className="bg-background border border-border p-8 rounded-3xl shadow-xl animate-fade-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold">Pattern Alert</h3>
                    <p className="text-sm text-muted">AI Insight Engine</p>
                  </div>
                </div>
                <p className="text-sm text-foreground font-medium mb-4 leading-relaxed">
                  &quot;You are entering a high-risk window based on your recent behavior. Want to launch your 2-minute reset now?&quot;
                </p>
                <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading tracking-tight">Built to feel smooth, calm, and decisive.</h2>
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Every core action is one or two taps, with just enough motion to guide attention without overload.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glass-card hover:border-primary/45 transition-all duration-300 group hover:-translate-y-1">
              <Activity className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Adaptive Analytics</h3>
              <p className="text-muted leading-relaxed text-sm">
                Spot trigger patterns in seconds with trend cards designed for fast comprehension.
              </p>
            </div>
            <div className="p-8 rounded-3xl glass-card hover:border-accent/45 transition-all duration-300 group hover:-translate-y-1">
              <HeartPulse className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">SOS Reset Flows</h3>
              <p className="text-muted leading-relaxed text-sm">
                One-button guided routines to lower urge intensity and reset your nervous system.
              </p>
            </div>
            <div className="p-8 rounded-3xl glass-card hover:border-emerald-500/45 transition-all duration-300 group hover:-translate-y-1">
              <Lock className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Private by Default</h3>
              <p className="text-muted leading-relaxed text-sm">
                Encryption, no data resale, and trust-forward UX language that increases user confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface border-t border-border px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading tracking-tight">Simple pricing, stronger commitment.</h2>
              <p className="text-muted text-sm md:text-base">Start free, then unlock premium when you&apos;re ready to go further.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {/* Free Tier */}
              <div className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col hover:border-border/80 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm">Essentials</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-xs text-muted">forever</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" /> Daily Check-ins</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" /> Urge Log</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" /> SOS Reset Button</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" /> Community Chat</li>
                </ul>
                <Link href="/register" className="w-full py-2.5 rounded-xl border border-border text-center text-xs font-bold hover:bg-surface transition-colors">
                  Get Started
                </Link>
              </div>

              {/* 1 Month Premium */}
              <Link href="/dashboard/upgrade" className="group relative rounded-2xl border border-border/60 bg-background p-5 flex flex-col hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Crown className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm">1 Month</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold">$5.99</span>
                  <span className="text-xs text-muted">/month</span>
                </div>
                <p className="text-[10px] text-muted mb-4 leading-relaxed">Flexible access to all premium features.</p>
                <div className="mt-auto flex items-center gap-1.5 text-primary text-xs font-bold">
                  View Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* 3 Months Premium - Highlighted */}
              <Link href="/dashboard/upgrade" className="group relative rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 to-background p-5 flex flex-col shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-primary to-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  MOST POPULAR
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary/15 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-primary">3 Months</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-2xl font-bold">$14.99</span>
                  <span className="text-xs text-muted">/3 months</span>
                </div>
                <p className="text-[10px] text-emerald-500 font-semibold mb-3">Save 17% vs monthly</p>
                <p className="text-[10px] text-muted mb-4 leading-relaxed flex-1">Best balance of commitment and savings.</p>
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                  View Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* 1 Year Premium */}
              <Link href="/dashboard/upgrade" className="group relative rounded-2xl border border-border/60 bg-background p-5 flex flex-col hover:border-amber-500/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  SAVE 30%
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-sm">1 Year</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold">$49.99</span>
                  <span className="text-xs text-muted">/year</span>
                </div>
                <p className="text-[10px] text-muted mb-4 leading-relaxed flex-1">Lowest monthly cost for long-term support.</p>
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                  View Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto rounded-3xl glass-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Start now and feel the shift this week.</h2>
            <p className="text-muted text-lg leading-relaxed mb-8 max-w-3xl mx-auto">Small daily actions compound fast when the experience is clear, encouraging, and built for follow-through.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-foreground">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10"><Zap className="w-4 h-4 text-primary" /> Fast actions</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15"><Compass className="w-4 h-4 text-accent" /> Clear guidance</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Trust-first UX</span>
            </div>
            <div className="mt-8">
              <Link href="/register" transitionTypes={['nav-forward']} className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-20 px-6">
          <div className="max-w-5xl mx-auto glass-card rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-3">Popular recovery guides</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link href="/quit-doomscrolling" className="rounded-xl border border-border px-4 py-3 hover:bg-surface-hover transition-colors font-semibold">Quit Doomscrolling Tracker</Link>
              <Link href="/porn-recovery-tracker" className="rounded-xl border border-border px-4 py-3 hover:bg-surface-hover transition-colors font-semibold">Porn Recovery Tracker Plan</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-[1.2fr_auto] items-start">
          <div>
            <div className="flex items-center gap-2 text-muted mb-3">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold">StopGoon</span>
            </div>
            <h3 className="text-base font-bold text-foreground">About Us</h3>
            <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
              StopGoon is built by a solo programmer from Macedonia with one year of hands-on experience,
              focused on creating a practical, private, and supportive recovery tool people can actually stick with.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-3 text-sm text-muted font-medium">
            <Link href="/privacy" transitionTypes={['nav-forward']} className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" transitionTypes={['nav-forward']} className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="mailto:stopgoonsupport@gmail.com" className="hover:text-foreground transition-colors">Contact Us: stopgoonsupport@gmail.com</Link>
          </div>
        </div>
      </footer>

      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 space-y-2">
        <Link
          href="mailto:stopgoonsupport@gmail.com"
          className="w-full inline-flex items-center justify-center rounded-full bg-background/95 border border-border px-4 py-2.5 text-xs font-semibold text-muted shadow-lg backdrop-blur"
        >
          Contact Us: stopgoonsupport@gmail.com
        </Link>
        <Link href="/register" transitionTypes={['nav-forward']} className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3.5 rounded-full shadow-xl shadow-primary/35 transition-all">
          Start Free Trial <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
