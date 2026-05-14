import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Porn Recovery Tracker',
  description: 'Track porn recovery with private check-ins, relapse intelligence, and accountability support in StopGoon.',
}

export default function PornRecoveryTrackerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary font-bold mb-6"><ShieldCheck className="w-4 h-4" /> StopGoon Guide</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Porn recovery tracker for consistent, private progress</h1>
        <p className="text-muted text-lg mb-8">Replace guilt cycles with clear behavior feedback, supportive recovery prompts, and weekly reflection loops.</p>
        <div className="glass-card rounded-2xl p-6 mb-8">
          <p className="font-semibold mb-2">What makes this different</p>
          <p className="text-sm text-muted">No shame-based streak pressure. You get trigger mapping, SOS intervention, and accountability tools that keep you in motion.</p>
        </div>
        <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold transition-colors">
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
