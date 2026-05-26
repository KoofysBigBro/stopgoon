import type { Metadata } from 'next'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'StopGoon privacy policy — how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://stopgoon.xyz/privacy',
  },
}

export default function PrivacyPolicy() {
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

      <main id="main-content" className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 font-heading">Privacy Policy</h1>
        <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert prose-indigo max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-muted leading-relaxed">
              We collect information you provide directly to us when you create an account, such as your email address and any recovery-related data (e.g., journal entries, triggers, and check-ins).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, including the AI predictive insights and personalized recovery timelines. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
            <p className="text-muted leading-relaxed">
              Your recovery data is hosted securely using enterprise-grade PostgreSQL encryption. We implement reasonable security measures to protect your personal information from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Services</h2>
            <p className="text-muted leading-relaxed">
              We may use third-party services (such as Supabase for database management and Google AdSense for monetization) that collect, monitor, and analyze data to help improve our service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at stopgoonsupport@gmail.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
