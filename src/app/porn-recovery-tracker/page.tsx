import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, BarChart3, Heart, Users, Brain, CheckCircle2, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Porn Recovery Tracker — Private, Shame-Free Progress Tracking',
  description: 'Track porn recovery with private daily check-ins, relapse intelligence, and accountability support. StopGoon measures Days of Growth, not streaks, so progress never resets to zero.',
  alternates: {
    canonical: 'https://stopgoon.xyz/porn-recovery-tracker',
  },
  openGraph: {
    title: 'Porn Recovery Tracker — Private, Shame-Free Progress Tracking',
    description: 'Track porn recovery with private daily check-ins, relapse intelligence, and accountability support. Days of Growth, not streaks.',
    url: 'https://stopgoon.xyz/porn-recovery-tracker',
    type: 'website',
  },
  twitter: {
    title: 'Porn Recovery Tracker — Private, Shame-Free Progress Tracking',
    description: 'Track porn recovery with private daily check-ins, relapse intelligence, and accountability support.',
  },
}

export default function PornRecoveryTrackerPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is my data private?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All check-ins, journal entries, and urge logs are encrypted. We do not sell or share your data. Recovery is personal, and we built StopGoon to respect that.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens when I relapse?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nothing punitive. Log the relapse, note what triggered it, and continue. Your Days of Growth count does not reset — it keeps growing. That slip becomes a data point that helps you understand your patterns better.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a premium subscription to use the tracker?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The core tracking features — daily check-ins, urge logging, SOS reset, and community chat — all available on the free Essentials plan.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use this anonymously?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You only need an email to create an account. No real name required. You can use a pseudonym in the community chat.',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold">StopGoon</span>
          </Link>
          <Link href="/register" className="text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-hover transition-colors">
            Start Free
          </Link>
        </div>
      </nav>

      <main id="main-content" className="px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary font-bold mb-6 text-sm">
          <ShieldCheck className="w-4 h-4" /> StopGoon Guide
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
          Porn recovery tracker for consistent, private progress
        </h1>

        <p className="text-muted text-lg mb-8 leading-relaxed">
          Most porn recovery tools make you feel worse about yourself. They punish slips with streak resets, 
          shame-based language, and public leaderboards that turn recovery into a performance. 
          StopGoon takes a different approach: private, shame-free progress tracking that treats relapses 
          as data points, not failures.
        </p>

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">What makes this different</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: BarChart3, label: 'Days of Growth', desc: 'Your progress never resets to zero. A lapse adds context, not shame.' },
              { icon: Brain, label: 'Trigger Mapping', desc: 'AI identifies patterns in your urges so you can predict and prevent relapses.' },
              { icon: Heart, label: 'SOS Intervention', desc: 'One-tap guided breathing and grounding exercises for high-risk moments.' },
              { icon: Users, label: 'Accountability Tools', desc: 'Optional partner connections and private community chat.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-3 p-4 rounded-xl bg-background/60 border border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{label}</h3>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">Why shame-based trackers fail</h2>
          <p className="text-muted mb-4 leading-relaxed">
            Traditional porn recovery apps use streak counters. When you relapse, your streak drops to zero. 
            This triggers the "What the Hell" effect — a well-documented psychological phenomenon where a single 
            slip leads to an extended binge because "the streak is already broken anyway."
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            This approach works for positive habits like going to the gym, but it is fundamentally flawed for 
            addiction recovery. Addiction involves shame cycles, and streak counters amplify those cycles. 
            Research shows that shame is the single biggest predictor of relapse — not because the person is weak, 
            but because shame triggers avoidance behavior instead of learning behavior.
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            StopGoon replaces streak counting with <strong className="text-foreground">Days of Growth</strong>. 
            If you were clean for 60 days, relapsed once, then stayed clean for 10 more days, your growth is 
            70 days — not 10. Your brain does not unlearn 60 days of rewiring overnight. This single change 
            eliminates the shame spiral and keeps you moving forward.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">How the tracker works</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Daily check-in', desc: 'Two minutes each day. Rate your mood, log any urges, and set your intention. No judgment, just awareness.' },
              { step: '02', title: 'Urge intelligence', desc: 'Every urge you log builds a personal trigger map. StopGoon learns when and why your risk spikes, then alerts you before high-risk windows.' },
              { step: '03', title: 'SOS rescue tools', desc: 'When an urge hits hard, tap the SOS button for guided breathing, grounding exercises, and a direct line to the AI coach.' },
              { step: '04', title: 'Weekly review', desc: 'Each week, review your patterns in clean, simple analytics. See your Days of Growth grow, identify trigger clusters, and adjust your strategy.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 rounded-xl glass-card">
                <span className="text-primary font-bold text-lg w-8 shrink-0">{step}</span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-muted mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-indigo-500/5 border border-primary/10">
          <h2 className="text-xl font-bold mb-4 font-heading flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Features designed for recovery
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              'Private by default — your data stays yours',
              'Non-judgmental AI coaching available 24/7',
              'No public leaderboards or shame metrics',
              'Encrypted check-ins and journal entries',
              'Customizable daily reminder nudges',
              'Accountability partner system (optional)',
              'Predictive risk window warnings',
              'Community chat with others in recovery',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-muted">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">Who is this for</h2>
          <p className="text-muted mb-4 leading-relaxed">
            This tracker is designed for anyone who has tried to quit watching porn and found that 
            willpower alone was not enough. It is for people who are tired of shame-based streak counters 
            that make them feel worse after a relapse. It is for people who want data-driven insights 
            about their triggers, not judgment about their failures.
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            Whether you are on day 1 or day 1000, the tracker meets you where you are. There is no 
            minimum streak required. No judgement if you slip. Just consistent, private progress tracking 
            that adapts to your journey.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Is my data private?', a: 'Yes. All check-ins, journal entries, and urge logs are encrypted. We do not sell or share your data. Recovery is personal, and we built StopGoon to respect that.' },
              { q: 'What happens when I relapse?', a: 'Nothing punitive. Log the relapse, note what triggered it, and continue. Your Days of Growth count does not reset — it keeps growing. That slip becomes a data point that helps you understand your patterns better.' },
              { q: 'Do I need a premium subscription to use the tracker?', a: 'No. The core tracking features — daily check-ins, urge logging, SOS reset, and community chat — are all available on the free Essentials plan.' },
              { q: 'Can I use this anonymously?', a: 'Yes. You only need an email to create an account. No real name required. You can use a pseudonym in the community chat.' },
            ].map(({ q, a }) => (
              <div key={q} className="p-4 rounded-xl glass-card">
                <h3 className="font-bold text-sm mb-1">{q}</h3>
                <p className="text-sm text-muted">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center p-8 rounded-2xl glass-card">
          <h2 className="text-2xl font-bold mb-3 font-heading">Start tracking your recovery today</h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            No credit card required. No shame-based streaks. Just private, intelligent progress tracking.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted mt-4">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </main>

      {/* Dynamic JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
