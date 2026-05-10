"use client";

import React, { useState } from 'react';
import { CheckCircle2, Shield, Heart, Sparkles } from 'lucide-react';

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = () => {
    // In the future, this will redirect to Lemon Squeezy/Paddle checkout
    console.log(`Initiating checkout for ${billingCycle} plan`);
    alert(`Checkout integration coming soon! Selected: ${billingCycle}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
          Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Recovery</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          We believe core recovery tools should always be free. Reclaim Premium offers deeper insights and personalized coaching to accelerate your healing journey.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-surface border border-border p-1 rounded-full inline-flex relative shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              billingCycle === 'monthly' ? 'text-white' : 'text-muted hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              billingCycle === 'yearly' ? 'text-white' : 'text-muted hover:text-foreground'
            }`}
          >
            Yearly
            <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full font-bold">
              Save 30%
            </span>
          </button>
          
          {/* Active indicator pill */}
          <div 
            className="absolute top-1 bottom-1 w-[100px] bg-primary rounded-full transition-all duration-300 ease-spring"
            style={{ 
              transform: billingCycle === 'monthly' ? 'translateX(0)' : 'translateX(100%)',
              width: billingCycle === 'monthly' ? '100px' : '135px'
            }}
          />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Tier */}
        <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col hover:border-border/80 transition-colors">
          <div className="mb-6">
            <h3 className="text-2xl font-bold font-heading text-foreground mb-2">Core Recovery</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted">/forever</span>
            </div>
            <p className="text-sm text-muted mt-4">
              Everything you need to break the habit, completely free of charge. We will never paywall your basic healing.
            </p>
          </div>

          <div className="flex-grow space-y-4 mb-8">
            <FeatureItem text="Unlimited Streak Tracking" />
            <FeatureItem text="Basic Journal & Urge Logger" />
            <FeatureItem text="Emergency SOS Mode" />
            <FeatureItem text="Standard Analytics & Charts" />
            <FeatureItem text="Light & Dark Themes" />
          </div>

          <button disabled className="w-full py-3 px-4 rounded-xl font-medium border border-border bg-background text-muted cursor-default">
            Your Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="bg-surface border-2 border-primary rounded-2xl p-8 flex flex-col relative shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]">
          <div className="absolute top-0 right-6 transform -translate-y-1/2">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md shadow-primary/20">
              <Sparkles className="w-3 h-3" /> Recommended
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold font-heading text-foreground mb-2">Reclaim Premium</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">
                ${billingCycle === 'monthly' ? '5.99' : '49.99'}
              </span>
              <span className="text-muted">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            <p className="text-sm text-muted mt-4">
              Advanced AI insights, personalized routines, and deeper analytics to accelerate your progress.
            </p>
          </div>

          <div className="flex-grow space-y-4 mb-8">
            <FeatureItem text="Everything in Core, plus:" highlight />
            <FeatureItem text="AI-Powered Trigger Analysis" premium />
            <FeatureItem text="Predictive Relapse Warnings" premium />
            <FeatureItem text="Accountability Partner Linking" premium />
            <FeatureItem text="Custom SOS Routines" premium />
            <FeatureItem text="Advanced Mood & Recovery Charts" premium />
            <FeatureItem text="Cloud Backups & Export" premium />
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full py-3 px-4 rounded-xl font-medium bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            Upgrade to Premium
          </button>
        </div>

      </div>

      {/* Trust & Safety Section */}
      <div className="max-w-2xl mx-auto text-center space-y-4 pt-8 border-t border-border mt-12">
        <Shield className="w-6 h-6 text-muted mx-auto mb-2" />
        <h4 className="font-medium text-foreground">Secure & Private</h4>
        <p className="text-sm text-muted">
          Your payment is securely processed by our Merchant of Record. We do not store your credit card information. Cancel anytime, no questions asked. 14-day money-back guarantee.
        </p>
      </div>

    </div>
  );
}

function FeatureItem({ text, premium = false, highlight = false }: { text: string, premium?: boolean, highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className={`w-5 h-5 shrink-0 ${premium ? 'text-primary' : highlight ? 'text-foreground' : 'text-muted'}`} />
      <span className={`text-sm ${highlight ? 'font-medium text-foreground' : 'text-muted'}`}>
        {text}
      </span>
    </div>
  );
}
