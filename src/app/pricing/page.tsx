import Link from 'next/link'
import { CheckCircle2, X, ShieldCheck, Crown, Star, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Pricing — Free & Premium Recovery Plans',
  description: 'Start free with daily check-ins, urge tracking, and SOS tools. Upgrade to Premium for AI coaching, predictive warnings, and advanced analytics.',
}

const features = [
  { label: 'Daily Check-ins', free: true, premium: true },
  { label: 'Urge Log & Intensity Tracking', free: true, premium: true },
  { label: 'SOS Breathing Reset', free: true, premium: true },
  { label: 'Community Chat', free: true, premium: true },
  { label: 'Journal', free: true, premium: true },
  { label: 'Basic Analytics Dashboard', free: true, premium: true },
  { label: 'AI-Powered Trigger Analysis', free: false, premium: true },
  { label: 'Predictive Relapse Warnings', free: false, premium: true },
  { label: 'Unlimited Custom SOS Routines', free: false, premium: true },
  { label: 'Advanced Trends & Data Export', free: false, premium: true },
  { label: 'Weekly AI Coaching Sessions', free: false, premium: true },
  { label: 'Recovery Timeline', free: false, premium: true },
  { label: 'Accountability Partners', free: false, premium: true },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="border-b border-border/40 bg-background/70 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary/15 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">Blog</Link>
            <Link href="/login" className="text-sm font-semibold text-muted hover:text-foreground transition-colors hidden sm:block">Log in</Link>
            <Link href="/register" className="text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/30">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-semibold mb-6 text-muted">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 font-heading">
            Start free. Go further<br className="hidden sm:block" /> when you&apos;re ready.
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            The core tools are free forever. Premium unlocks AI-powered insights and deeper recovery support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-4 mb-20">
          {/* Free */}
          <div className="rounded-2xl border border-border/60 bg-background p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/10 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-primary" /></div>
              <h2 className="font-bold">Free</h2>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold">€0</span>
              <span className="text-xs text-muted">forever</span>
            </div>
            <p className="text-xs text-muted mb-6 flex-1">Core tracking tools to start your recovery journey with zero commitment.</p>
            <Link href="/register" className="w-full py-2.5 rounded-xl border border-border text-center text-sm font-bold hover:bg-surface transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* 1 Month */}
          <Link href="/dashboard/upgrade" rel="nofollow" className="group rounded-2xl border border-border/60 bg-background p-6 flex flex-col hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform"><Crown className="w-4 h-4 text-primary" /></div>
              <h2 className="font-bold">1 Month</h2>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold">€5.99</span>
              <span className="text-xs text-muted">/month</span>
            </div>
            <p className="text-xs text-muted mb-6 flex-1">Flexible access. Perfect for testing premium guidance.</p>
            <div className="flex items-center gap-1.5 text-primary text-sm font-bold">
              View Plan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* 3 Months - Popular */}
          <Link href="/dashboard/upgrade" rel="nofollow" className="group relative rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 to-background p-6 flex flex-col shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/15 p-1.5 rounded-lg group-hover:scale-110 transition-transform"><Star className="w-4 h-4 text-primary fill-primary" /></div>
              <h2 className="font-bold text-primary">3 Months</h2>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold">€14.99</span>
              <span className="text-xs text-muted">/3 months</span>
            </div>
            <p className="text-xs text-emerald-500 font-semibold mb-1">Save 17% vs monthly</p>
            <p className="text-xs text-muted mb-6 flex-1">Best balance of commitment and savings while habits stabilize.</p>
            <div className="flex items-center gap-1.5 text-primary text-sm font-bold">
              View Plan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* 1 Year */}
          <Link href="/dashboard/upgrade" rel="nofollow" className="group relative rounded-2xl border border-border/60 bg-background p-6 flex flex-col hover:border-amber-500/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute -top-3 right-4 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">SAVE 30%</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform"><Crown className="w-4 h-4 text-amber-500" /></div>
              <h2 className="font-bold">1 Year</h2>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold">€49.99</span>
              <span className="text-xs text-muted">/year</span>
            </div>
            <p className="text-xs text-muted mb-6 flex-1">Lowest monthly cost for long-term recovery support.</p>
            <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold">
              View Plan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-heading">What&apos;s included</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-surface px-6 py-3 border-b border-border">
              <span className="text-sm font-bold text-muted">Feature</span>
              <span className="text-sm font-bold text-center text-muted">Free</span>
              <span className="text-sm font-bold text-center text-primary">Premium</span>
            </div>
            {/* Rows */}
            {features.map((f, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-3.5 items-center ${i % 2 === 0 ? 'bg-background' : 'bg-surface/40'} ${i < features.length - 1 ? 'border-b border-border/50' : ''}`}>
                <span className="text-sm font-medium">{f.label}</span>
                <div className="flex justify-center">
                  {f.free
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <X className="w-4 h-4 text-muted/40" />}
                </div>
                <div className="flex justify-center">
                  {f.premium
                    ? <CheckCircle2 className="w-4 h-4 text-primary" />
                    : <X className="w-4 h-4 text-muted/40" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust + CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">Ready to go deeper?</h2>
            <p className="text-muted mb-6 leading-relaxed">Start with the free tools today. Upgrade when you want AI insights, predictive warnings, and personalized coaching.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard/upgrade" rel="nofollow" className="inline-flex items-center justify-center gap-2 border border-border bg-surface hover:bg-surface-hover font-bold px-7 py-3.5 rounded-full transition-colors">
                See Premium Plans
              </Link>
            </div>
          </div>
          <p className="text-sm text-muted">
            Secure checkout via Lemon Squeezy · 14-day money-back guarantee · Cancel anytime
          </p>
          <Link href="/refund" className="text-xs text-primary hover:underline mt-2 inline-block">View refund policy →</Link>
        </div>
      </main>

      <footer className="py-8 border-t border-border bg-background text-center text-sm text-muted">
        <p>© {new Date().getFullYear()} StopGoon · <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link> · <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></p>
      </footer>
    </div>
  )
}
