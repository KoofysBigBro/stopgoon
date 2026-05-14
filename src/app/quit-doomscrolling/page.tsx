import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quit Doomscrolling Tracker',
  description: 'Use StopGoon to quit doomscrolling with guided check-ins, SOS resets, and weekly behavior reviews.',
}

export default function QuitDoomscrollingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary font-bold mb-6"><ShieldCheck className="w-4 h-4" /> StopGoon Guide</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Quit doomscrolling with a system that actually sticks</h1>
        <p className="text-muted text-lg mb-8">Track patterns, interrupt urge loops fast, and build your focus back with a practical daily workflow.</p>
        <div className="glass-card rounded-2xl p-6 mb-8">
          <p className="font-semibold mb-2">3-step daily protocol</p>
          <p className="text-sm text-muted">1) 2-min check-in, 2) log any urge, 3) run SOS reset when risk spikes.</p>
        </div>
        <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold transition-colors">
          Start Free Tracker <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
