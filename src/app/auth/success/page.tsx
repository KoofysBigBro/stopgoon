import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function AuthSuccessPage() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4 py-10 relative overflow-hidden">

      <div className="w-full max-w-[420px] bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-10 shadow-xl relative z-10 animate-fade-up text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground mb-3">Verification Successful!</h1>
        <p className="text-muted leading-relaxed mb-8">
          Your email has been successfully verified. You can now close this tab to return to the app or continue to your dashboard.
        </p>
        <Link href="/dashboard" className="block w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 transition-all font-bold shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
