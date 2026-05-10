import Link from 'next/link'
import { ShieldCheck, Brain, Lock, TrendingDown, ArrowRight, CheckCircle2, Sparkles, Activity, Clock, FileJson } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl fixed top-0 w-full z-50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-foreground">
            <div className="bg-indigo-500/10 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-bold bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold mb-8 text-muted">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>The intelligent way to break digital habits</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] font-heading">
            Regain control of your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">digital habits.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            A private, science-backed system to break compulsive dopamine loops, overcome doomscrolling, and rebuild your focus—without the guilt trips of toxic streak culture.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center bg-foreground text-background dark:bg-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl">
              Start Your Recovery
            </Link>
            <p className="text-sm text-muted mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </p>
          </div>

          {/* Abstract Dashboard Mockup */}
          <div className="mt-20 relative mx-auto w-full max-w-4xl">
            <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-2xl blur-lg opacity-50" />
            <div className="relative bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="h-12 border-b border-border bg-background/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="p-8 grid grid-cols-3 gap-6 opacity-80 pointer-events-none">
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-32 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                    <div className="h-24 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                  </div>
                </div>
                <div className="col-span-1 space-y-4">
                  <div className="h-64 w-full bg-indigo-500/10 border border-indigo-500/20 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 bg-surface border-y border-border px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading tracking-tight">
                Why "Don't break the streak" is terrible advice.
              </h2>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                Traditional counters induce immense shame upon relapse. When you break a 60-day streak, you feel worthless, leading directly to binge behavior—the "What the Hell" effect.
              </p>
              <p className="text-foreground font-medium text-lg mb-8 leading-relaxed">
                StopGoon treats relapses as <span className="text-indigo-500">data points</span>, not failures. We analyze your triggers to help you prevent the next one.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-driven pattern recognition",
                  "Identify emotional triggers",
                  "Proactive relapse warnings"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-indigo-500/5 absolute -inset-10 blur-3xl -z-10" />
              <div className="bg-background border border-border p-8 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Pattern Alert</h3>
                    <p className="text-sm text-muted">AI Insight Engine</p>
                  </div>
                </div>
                <p className="text-sm text-foreground font-medium mb-4 leading-relaxed">
                  "Based on your history, you usually struggle around Day 7 on weekend evenings. Be extra careful tonight. Here is a custom focus routine."
                </p>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading tracking-tight">A clinical approach to recovery.</h2>
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Everything you need to map your triggers, calm your nervous system, and rewire your habits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-surface border border-border hover:border-indigo-500/30 transition-colors group">
              <Activity className="w-8 h-8 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">Advanced Analytics</h3>
              <p className="text-muted leading-relaxed text-sm">
                Visualize your mood, urges, and check-ins on a beautiful heatmap. Spot long-term trends instead of just counting days.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-surface border border-border hover:border-red-500/30 transition-colors group">
              <ShieldCheck className="w-8 h-8 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">SOS Emergency Mode</h3>
              <p className="text-muted leading-relaxed text-sm">
                Hit the panic button when an urge hits. Follow an interactive, guided breathing routine to lower your dopamine spikes instantly.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-surface border border-border hover:border-emerald-500/30 transition-colors group">
              <Lock className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">100% Private</h3>
              <p className="text-muted leading-relaxed text-sm">
                Your data is yours. Hosted securely with enterprise-grade encryption. No tracking, no data selling, complete anonymity.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-surface border-t border-border px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Simple, transparent pricing.</h2>
              <p className="text-muted">Start for free. Upgrade when you are ready to get deep insights.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Tier */}
              <div className="p-8 rounded-3xl bg-background border border-border flex flex-col">
                <h3 className="text-xl font-bold mb-2">The Essentials</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted">forever</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-muted" /> Daily Check-ins</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-muted" /> Basic Urge Logging</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-muted" /> SOS Panic Button</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-muted" /> Community Chat</li>
                </ul>
                <Link href="/register" className="w-full py-3 rounded-xl border border-border text-center font-bold hover:bg-surface transition-colors">
                  Get Started
                </Link>
              </div>

              {/* Premium Tier */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900/40 to-background border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 flex flex-col relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
                <h3 className="text-xl font-bold mb-2 text-indigo-400">Deep Insights</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$5.99</span>
                  <span className="text-muted">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Everything in Free</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> AI Predictive Relapse Warnings</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Custom SOS Routines</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Advanced Recovery Timeline</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> JSON Data Exports</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Ad-Free Experience</li>
                </ul>
                <Link href="/register" className="w-full py-3 rounded-xl bg-indigo-600 text-white text-center font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                  Start 7-Day Trial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold">StopGoon</span>
          </div>
          <div className="flex gap-6 text-sm text-muted font-medium">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="mailto:support@stopgoon.com" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
