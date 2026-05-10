import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using StopGoon ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
            <p>StopGoon is a digital wellness and habit-tracking tool. The Service is provided "as is" and is intended for personal self-improvement. It does not replace professional medical or psychological advice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Subscriptions</h2>
            <p>Some features of the Service are billed on a subscription basis ("Premium"). You will be billed in advance on a recurring and periodic basis. You may cancel your subscription at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Disclaimer</h2>
            <p>StopGoon makes no guarantees regarding the outcome or success of your habit-changing efforts. We provide tools to assist you, but the results depend on your individual effort.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
