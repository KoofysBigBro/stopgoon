import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Lock, TrendingDown, ArrowRight, CheckCircle2, Sparkles, Activity, HeartPulse, Zap, Compass, Users, BadgeCheck, Crown, Star } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getVariant } from '@/utils/experiments'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'StopGoon — Overcome Addiction, Dopamine Detox & Build Discipline'
  },
  description: 'Break compulsive digital habits, track your porn recovery, and quit doomscrolling. StopGoon is a private, shame-free recovery tracker designed to rewire your brain.',
  keywords: [
    'nofap tracker app',
    'porn addiction recovery app',
    'how to stop compulsive habits',
    'free habit tracker for addiction',
    'urge tracking app',
    'stop gooning app',
    'dopamine detox',
    'quit doomscrolling',
    'self discipline'
  ],
  alternates: {
    canonical: 'https://stopgoon.xyz',
  },
  openGraph: {
    title: 'StopGoon — Overcome Addiction, Dopamine Detox & Build Discipline',
    description: 'Break compulsive digital habits, track your porn recovery, and quit doomscrolling with our private, shame-free recovery tracker.',
    url: 'https://stopgoon.xyz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StopGoon — Overcome Addiction, Dopamine Detox & Build Discipline',
    description: 'Break compulsive digital habits, track your porn recovery, and quit doomscrolling with our private, shame-free recovery tracker.',
  },
}

export default async function LandingPage() {
  let user = null
  let heroVariant: 'focus' | 'freedom' = 'focus'

  try {
    const supabase = await createClient()
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u
    const variant = await getVariant('home_hero', ['focus', 'freedom'] as const, 'focus')
    if (variant === 'focus' || variant === 'freedom') heroVariant = variant
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error('Landing page auth check failed:', e)
  }

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'StopGoon',
    url: 'https://stopgoon.xyz',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires HTML5 compatible browser',
    description: 'StopGoon is a private recovery web tool that helps individuals overcome compulsive digital habits, manage dopamine detox, and track their porn recovery without shame.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'EUR',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StopGoon',
    url: 'https://stopgoon.xyz',
    logo: 'https://stopgoon.xyz/icon.svg',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'stopgoonsupport@gmail.com',
      contactType: 'customer support',
    },
  }

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      <nav aria-label="Main navigation" className="border-b border-border/40 bg-background/70 backdrop-blur-xl fixed top-0 w-full z-50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-foreground">
            <div className="bg-primary/15 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">
              Blog
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5">
              Create Free Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Floating Right Ad Sidebar (Desktop XL) */}
      <aside className="hidden xl:flex w-[260px] flex-col fixed right-6 top-32 z-40 pointer-events-auto">
        <div className="bg-surface/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-1">Sponsor</p>
          <AdBanner isPremium={false} slot="front-page-sidebar" format="vertical" />
        </div>
      </aside>

      <main className="pt-32 relative z-10">
        <section className="pb-20 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-semibold mb-8 text-muted animate-fade-up">
            <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>Free habit tracker for addiction & compulsive habits</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] font-heading animate-fade-up-delay">
            {heroVariant === 'freedom'
              ? 'The urge is temporary. Your recovery is permanent.'
              : "You're not broken. You're building something stronger."}
          </h1>

          <p className="text-lg md:text-xl text-muted mb-10 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-up-delay">
            StopGoon is a private **porn addiction recovery app** and **nofap tracker app** designed to help you learn **how to stop compulsive habits**. Use our free **urge tracking app** for daily check-ins, SOS breathing resets, and smart insights — all without shame or judgment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl">
              Start Your Recovery
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Link>
            <p className="text-sm text-muted mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" /> No credit card required
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-muted">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Encrypted by default</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" aria-hidden="true" /> 2,400+ people on their journey</span>
            <span className="px-3 py-1 rounded-full bg-accent/15 text-foreground">No shame-based streak language</span>
          </div>

          <div className="mt-20 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-surface p-5 text-left">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-bold text-sm mb-1">Daily Check-ins</h3>
              <p className="text-xs text-muted">One tap to log your mood and build awareness.</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 text-left">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-sm mb-1">Urge Tracking</h3>
              <p className="text-xs text-muted">Log triggers and intensity to spot patterns.</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 text-left">
              <div className="text-2xl mb-2">🆘</div>
              <h3 className="font-bold text-sm mb-1">SOS Rescue</h3>
              <p className="text-xs text-muted">Breathing exercises and grounding when urges hit.</p>
            </div>
          </div>
        </section>

        {/* Mobile Ad Banner */}
        <div className="block xl:hidden px-6 max-w-4xl mx-auto my-12">
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-1 text-center">Sponsor</p>
           <AdBanner isPremium={false} slot="mobile-front-page" format="rectangle" />
        </div>

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
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
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
                    <TrendingDown className="w-6 h-6 text-accent" aria-hidden="true" />
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

        <section className="py-24 px-6 bg-surface border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading tracking-tight">What users are saying</h2>
              <p className="text-muted max-w-xl mx-auto text-lg">Real people using StopGoon to rebuild their habits and their lives.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { text: "I relapsed 4 times using other apps and always felt like garbage afterward. With StopGoon, my relapse last month didn't spiral — I logged it, did the breathing reset, and was back on track the next morning.", name: "Marcus T.", tag: "41 days since last relapse", initials: "MT" },
                { text: "The SOS button has literally stopped me mid-urge at least 6 times. I open it, do the breathing exercise, and by the time it's done the feeling has passed. Nothing else has ever worked like this for me.", name: "Ryan K.", tag: "Using for 3 months", initials: "RK" },
                { text: "I love that it doesn't shame me. The 'Days of Growth' instead of a streak counter changed my whole mindset. It's not about perfection — it's about pattern. That reframe alone was worth it.", name: "Daniel S.", tag: "Using for 6 weeks", initials: "DS" },
              ].map((t, i) => (
                <div key={i} className="bg-background border border-border rounded-2xl p-6 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-6 flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t border-border pt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">{t.initials}</div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted">{t.tag}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              <Activity className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Adaptive Analytics</h3>
              <p className="text-muted leading-relaxed text-sm">
                Spot trigger patterns in seconds with trend cards designed for fast comprehension.
              </p>
            </div>
            <div className="p-8 rounded-3xl glass-card hover:border-accent/45 transition-all duration-300 group hover:-translate-y-1">
              <HeartPulse className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">SOS Reset Flows</h3>
              <p className="text-muted leading-relaxed text-sm">
                One-button guided routines to lower urge intensity and reset your nervous system.
              </p>
            </div>
            <div className="p-8 rounded-3xl glass-card hover:border-emerald-500/45 transition-all duration-300 group hover:-translate-y-1">
              <Lock className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
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
                    <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-sm">Essentials</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold">€0</span>
                  <span className="text-xs text-muted">forever</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" aria-hidden="true" /> Daily Check-ins</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" aria-hidden="true" /> Urge Log</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" aria-hidden="true" /> SOS Reset Button</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><CheckCircle2 className="w-3 h-3 text-muted shrink-0" aria-hidden="true" /> Community Chat</li>
                </ul>
                <Link href="/register" className="w-full py-2.5 rounded-xl border border-border text-center text-xs font-bold hover:bg-surface transition-colors">
                  Get Started
                </Link>
              </div>

              {/* 1 Month Premium */}
              <Link href="/dashboard/upgrade" rel="nofollow" className="group relative rounded-2xl border border-border/60 bg-background p-5 flex flex-col hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Crown className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-sm">1 Month</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold">€5.99</span>
                  <span className="text-xs text-muted">/month</span>
                </div>
                <p className="text-[10px] text-muted mb-4 leading-relaxed">Flexible access to all premium features.</p>
                <div className="mt-auto flex items-center gap-1.5 text-primary text-xs font-bold">
                   View Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
              </Link>

              {/* 3 Months Premium - Highlighted */}
              <Link href="/dashboard/upgrade" rel="nofollow" className="group relative rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 to-background p-5 flex flex-col shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-primary to-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  MOST POPULAR
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary/15 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4 text-primary fill-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-sm text-primary">3 Months</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-2xl font-bold">€14.99</span>
                  <span className="text-xs text-muted">/3 months</span>
                </div>
                <p className="text-[10px] text-emerald-500 font-semibold mb-3">Save 17% vs monthly</p>
                <p className="text-[10px] text-muted mb-4 leading-relaxed flex-1">Best balance of commitment and savings.</p>
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                  View Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
              </Link>

              {/* 1 Year Premium */}
              <Link href="/dashboard/upgrade" rel="nofollow" className="group relative rounded-2xl border border-border/60 bg-background p-5 flex flex-col hover:border-amber-500/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  SAVE 30%
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Crown className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-sm">1 Year</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold">€49.99</span>
                  <span className="text-xs text-muted">/year</span>
                </div>
                <p className="text-[10px] text-muted mb-4 leading-relaxed flex-1">Lowest monthly cost for long-term support.</p>
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                  View Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10"><Zap className="w-4 h-4 text-primary" aria-hidden="true" /> Fast actions</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15"><Compass className="w-4 h-4 text-accent" aria-hidden="true" /> Clear guidance</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10"><ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Trust-first UX</span>
            </div>
            <div className="mt-8">
              <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                Create Free Account <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
              <Link href="/blog" className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors font-semibold text-primary col-span-full text-center">
                Browse All Blog Articles →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-[1.2fr_auto] items-start">
          <div>
            <div className="flex items-center gap-2 text-muted mb-3">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              <span className="font-bold">StopGoon</span>
            </div>
              <h3 className="text-base font-bold text-foreground">About Us</h3>
              <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
                StopGoon is a privacy-focused recovery tool designed to help people break compulsive habits
                and build a healthier relationship with themselves.
              </p>
              <div className="mt-4 flex justify-start">
                <a href="https://launchigniter.com/product/stopgoon?ref=badge-stopgoon" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity">
                  <Image
                    src="https://launchigniter.com/api/badge/stopgoon?theme=dark"
                    alt="Featured on LaunchIgniter"
                    width={212}
                    height={55}
                    className="max-w-full h-auto"
                  />
                </a>
              </div>
          </div>
          <div className="flex flex-col md:items-end gap-3 text-sm text-muted font-medium">
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="mailto:stopgoonsupport@gmail.com" className="hover:text-foreground transition-colors">Contact Us: stopgoonsupport@gmail.com</Link>
          </div>
        </div>
      </footer>

      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
        <Link href="/register" className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3.5 rounded-full shadow-xl shadow-primary/35 transition-all">
          Start Your Recovery <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Dynamic JSON-LD WebApplication & Organization Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </div>
  )
}
