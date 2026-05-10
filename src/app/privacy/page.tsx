import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, log a journal entry, or contact support. This includes your email address and any usage data necessary to provide the habit-tracking features.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. Your personal data is used solely to generate your statistics, streaks, and personalized insights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction. We respect the deeply personal nature of the data you log.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Third-Party Services</h2>
            <p>We use trusted third-party services for payments (e.g., Paddle) and database hosting (e.g., Supabase). We do not sell your personal data to advertisers or third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through the application.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
