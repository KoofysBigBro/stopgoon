import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'StopGoon refund policy — our 7-day money-back guarantee terms.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-heading font-bold mb-8">Refund Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. General Refund Policy</h2>
            <p>We want you to be completely satisfied with StopGoon Premium. If you are not satisfied with your subscription, we offer a 14-day money-back guarantee for your initial purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Subscription Cancellations</h2>
            <p>You may cancel your Premium subscription at any time. When you cancel, you will continue to have access to Premium features until the end of your current billing cycle.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Requesting a Refund</h2>
            <p>To request a refund within the 14-day window, please contact support through the application or via our billing provider (Paddle). Please include your account email and order reference number.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Exceptions</h2>
            <p>We reserve the right to refuse a refund request if we detect abuse of our refund policy or significant violation of our Terms of Service.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
