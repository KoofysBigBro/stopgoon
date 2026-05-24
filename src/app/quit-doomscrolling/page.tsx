import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Moon, Zap, Brain, Clock, CheckCircle2, Activity, BookHeart, LifeBuoy } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quit Doomscrolling Tracker — Break the Scroll Loop',
  description: 'Use StopGoon to quit doomscrolling with guided daily check-ins, SOS reset tools, and weekly behavior reviews. Track your focus recovery with data, not shame.',
  alternates: {
    canonical: 'https://stopgoon.xyz/quit-doomscrolling',
  },
  openGraph: {
    title: 'Quit Doomscrolling Tracker — Break the Scroll Loop',
    description: 'Quit doomscrolling with guided daily check-ins, SOS reset tools, and weekly behavior reviews.',
    url: 'https://stopgoon.xyz/quit-doomscrolling',
    type: 'website',
  },
  twitter: {
    title: 'Quit Doomscrolling Tracker — Break the Scroll Loop',
    description: 'Quit doomscrolling with guided daily check-ins, SOS reset tools, and weekly behavior reviews.',
  },
}

export default function QuitDoomscrollingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can this really help me stop scrolling?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on your commitment, but the system is designed to address the root cause — not just the symptom. By tracking your patterns, you become aware of when and why you scroll. Awareness is the first step to change.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is this different from screen time settings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Phone screen time settings just show you a number. StopGoon shows you patterns: what time of day, what emotional state, and what triggers your scrolling. It also gives you tools to intervene in the moment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need premium?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. All core doomscrolling tracking features — daily check-ins, urge logging, SOS tools, and community chat — are free on the Essentials plan.',
        },
      },
      {
        '@type': 'Question',
        name: 'What if I relapse into scrolling?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Log it and move on. There is no streak to break. StopGoon tracks Days of Focus — your total progress, not your consecutive streak. One scroll session does not erase your progress.',
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

      <main className="px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary font-bold mb-6 text-sm">
          <ShieldCheck className="w-4 h-4" /> StopGoon Guide
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
          Quit doomscrolling with a system that actually sticks
        </h1>

        <p className="text-muted text-lg mb-8 leading-relaxed">
          Doomscrolling is not a lack of willpower. It is a neurological pattern your brain has learned: 
          pick up phone, scroll, get small dopamine hit, repeat. The platforms are designed by former 
          casino engineers to maximize your time on screen. Fighting this with sheer willpower is like 
          trying to outrun a car — you need a different approach.
        </p>

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">3-step daily protocol</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: '2-min check-in', icon: Clock, desc: 'Rate your focus, log scroll time, set an intention for the day.' },
              { step: '2', title: 'Log any urge', icon: Brain, desc: 'Every scroll urge is a data point. Track when and why it hits.' },
              { step: '3', title: 'SOS when risk spikes', icon: LifeBuoy, desc: 'One tap launches guided breathing to interrupt the scroll loop.' },
            ].map(({ step, title, icon: Icon, desc }) => (
              <div key={step} className="p-4 rounded-xl bg-background/60 border border-border/60 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{step}</div>
                <h3 className="font-bold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">Why doomscrolling is so hard to stop</h2>
          <p className="text-muted mb-4 leading-relaxed">
            Doomscrolling hijacks the same neural pathways as gambling. Every time you pull to refresh, 
            your brain releases a small amount of dopamine in anticipation of the reward. This is called 
            a <strong className="text-foreground">variable reward schedule</strong> — the same mechanism 
            that makes slot machines addictive. You do not know if the next scroll will bring something 
            interesting, so you keep scrolling.
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            The problem is compounded at night. When you are tired, your prefrontal cortex (the part 
            responsible for willpower and decision-making) is exhausted. This makes 10 PM to 2 AM the 
            highest-risk window for compulsive scrolling. Your brain craves stimulation precisely when 
            it needs rest the most.
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            Traditional advice like "just put your phone down" does not work because it does not address 
            the underlying neurological pattern. To actually quit doomscrolling, you need a system that 
            intercepts the urge loop before it starts, not just more willpower in the moment.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">How StopGoon helps you break the cycle</h2>
          <div className="space-y-4">
            {[
              { icon: Activity, title: 'Pattern recognition', desc: 'The tracker learns your personal doomscrolling patterns. It identifies your high-risk times, emotional triggers, and friction points, then alerts you before a scroll session starts.' },
              { icon: Moon, title: 'Evening wind-down protocol', desc: 'A guided evening check-in that shifts your brain from scrolling mode to rest mode. Includes a digital sunset reminder and a 10-minute wind-down routine.' },
              { icon: BookHeart, title: 'Replace, dont just remove', desc: 'For every scroll habit you cut, StopGoon suggests replacement activities. Reading, journaling, breathing exercises — meaningful alternatives that still feel good.' },
              { icon: Zap, title: 'Urge interruption tools', desc: 'When the scroll urge hits, the SOS button launches an immediate intervention: 60-second breathing, grounding exercises, or a quick conversation with the AI coach.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl glass-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-muted mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-sky-500/5 to-indigo-500/5 border border-sky-500/10">
          <h2 className="text-xl font-bold mb-4 font-heading flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" /> What you get
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              'Daily check-ins to track scroll time',
              'Urge logging with context tagging',
              'AI pattern detection and risk alerts',
              'SOS breathing and grounding exercises',
              'Weekly behavior review reports',
              'Private journal for reflection',
              'Accountability partner system',
              'Community chat with others quitting',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-muted">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-heading">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can this really help me stop scrolling?', a: 'It depends on your commitment, but the system is designed to address the root cause — not just the symptom. By tracking your patterns, you become aware of when and why you scroll. Awareness is the first step to change.' },
              { q: 'How is this different from screen time settings?', a: 'Phone screen time settings just show you a number. StopGoon shows you patterns: what time of day, what emotional state, and what triggers your scrolling. It also gives you tools to intervene in the moment.' },
              { q: 'Do I need premium?', a: 'No. All core doomscrolling tracking features — daily check-ins, urge logging, SOS tools, and community chat — are free on the Essentials plan.' },
              { q: 'What if I relapse into scrolling?', a: 'Log it and move on. There is no streak to break. StopGoon tracks Days of Focus — your total progress, not your consecutive streak. One scroll session does not erase your progress.' },
            ].map(({ q, a }) => (
              <div key={q} className="p-4 rounded-xl glass-card">
                <h3 className="font-bold text-sm mb-1">{q}</h3>
                <p className="text-sm text-muted">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center p-8 rounded-2xl glass-card">
          <h2 className="text-2xl font-bold mb-3 font-heading">Start your focus recovery today</h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            No credit card required. Just a better system for taking back your attention.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5">
            Start Free Tracker <ArrowRight className="w-4 h-4" />
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
