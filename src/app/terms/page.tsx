import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2.5 text-foreground">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 font-heading">Terms of Service</h1>
        <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert prose-indigo max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted leading-relaxed">
              By accessing or using StopGoon, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Medical Disclaimer</h2>
            <p className="text-muted leading-relaxed">
              StopGoon is a digital wellness and habit-tracking tool, not a medical or psychiatric service. The information and tools provided do not constitute medical advice and should not replace consultation with a qualified healthcare professional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
            <p className="text-muted leading-relaxed">
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Subscriptions</h2>
            <p className="text-muted leading-relaxed">
              Some parts of the Service are billed on a subscription basis ("Premium"). You will be billed in advance on a recurring and periodic basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Termination</h2>
            <p className="text-muted leading-relaxed">
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
