"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  CheckCircle2, Shield, Sparkles, Star,   Crown, ArrowRight,
  TrendingUp, Brain, Heart, Zap, Activity, Target,
  ChevronRight, Quote, BarChart3, Clock, Gem
} from 'lucide-react';
import Link from 'next/link';
import SparkleEffect from '@/components/premium/SparkleEffect';

type PlanId = 'monthly' | 'quarterly' | 'yearly';

const plans = [
  {
    id: 'monthly' as const,
    name: '1 Month — Starter',
    shortName: 'Starter',
    price: 5.99,
    cadence: '/month',
    badge: null,
    badgeLabel: null,
    savings: null,
    color: 'from-primary to-emerald-500',
    shadowColor: 'shadow-primary/25',
    borderColor: 'border-primary/40',
    description: 'Perfect for testing premium guidance and building momentum.',
    popular: false,
  },
  {
    id: 'quarterly' as const,
    name: '3 Months — Balanced',
    shortName: 'Balanced',
    price: 14.99,
    cadence: '/3 months',
    badge: 'Most Popular',
    badgeLabel: 'Save 17%',
    savings: 'vs monthly',
    color: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-500/30',
    borderColor: 'border-indigo-500/50',
    description: 'Best balance of commitment and savings while habits stabilize.',
    popular: true,
  },
  {
    id: 'yearly' as const,
    name: '1 Year — Ultimate',
    shortName: 'Ultimate',
    price: 49.99,
    cadence: '/year',
    badge: 'Best Value',
    badgeLabel: 'Save 30%',
    savings: 'vs monthly',
    color: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/25',
    borderColor: 'border-amber-500/40',
    description: 'Maximum value for long-term recovery and consistency.',
    popular: false,
  },
];

const premiumFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Risk Analysis',
    desc: 'Real-time trigger detection and pattern recognition',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Relapse Warnings',
    desc: 'Get notified before your high-risk windows hit',
  },
  {
    icon: Heart,
    title: 'Custom SOS Routines',
    desc: 'Build personalized emergency plans for when urges strike',
  },
  {
    icon: Activity,
    title: 'Advanced Analytics & Export',
    desc: 'Deep trend breakdowns with full data export tools',
  },
  {
    icon: Target,
    title: 'Weekly AI Coaching',
    desc: 'Personalized recovery guidance based on your data',
  },
  {
    icon: BarChart3,
    title: 'Recovery Timeline',
    desc: 'Visualize your entire journey with milestone tracking',
  },
];

const testimonials = [
  {
    quote: "The predictive warnings caught me before I relapsed twice already. Worth every penny.",
    name: 'Alex M.',
    streak: '47-day streak',
  },
  {
    quote: "The SOS routines saved me more times than I can count. This app understands addiction.",
    name: 'Jordan T.',
    streak: '83-day streak',
  },
  {
    quote: "I've tried everything. The AI coach actually gets what I'm going through. Game changer.",
    name: 'Sam R.',
    streak: '120-day streak',
  },
];

function PlanCard({
  plan,
  active,
  onSelect,
  index,
}: {
  plan: typeof plans[0];
  active: boolean;
  onSelect: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rx', `${x * 12}deg`);
      card.style.setProperty('--ry', `${y * -12}deg`);
    };
    const handleLeave = () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div className={`animate-stagger-${index + 1}`}>
      <div
        ref={cardRef}
        onClick={onSelect}
        className={`
          relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 select-none
          ${active
            ? `${plan.borderColor} bg-gradient-to-b ${plan.color.split(' ')[0]}/10 to-background shadow-xl ${plan.shadowColor}`
            : 'border-border/60 bg-surface/50 hover:border-border hover:shadow-md hover:-translate-y-0.5'
          }
        `}
        style={{
          transform: 'perspective(800px) rotateX(calc(var(--ry, 0deg))) rotateY(calc(var(--rx, 0deg)))',
          transition: 'transform 0.15s ease-out, box-shadow 0.3s, border-color 0.3s, translate 0.3s',
        }}
      >
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30 animate-float-drift whitespace-nowrap">
              <Star className="w-3 h-3 fill-white" />
              Most Popular
            </div>
          </div>
        )}

        {/* Shine on hover */}
        <div className={`absolute inset-0 rounded-2xl overflow-hidden pointer-events-none ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-700`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -skew-x-12 translate-x-[-100%] animate-shine-hover" style={{ animation: 'shine-sweep 4s ease-in-out infinite' }} />
        </div>

        {/* Glow border for active */}
        {active && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-60">
            <div className={`absolute inset-0 rounded-2xl ${plan.shadowColor.replace('shadow', 'shadow')}`} style={{ filter: 'blur(8px)', background: `var(--primary)` }} />
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {plan.badgeLabel && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${active ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-500'}`}>
                    {plan.badgeLabel}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold truncate">{plan.badge}</span>
              </div>
              <h3 className={`text-lg font-heading font-bold truncate ${active ? '' : 'text-foreground'}`}>{plan.name}</h3>
            </div>
            {!plan.popular && (
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-2 transition-all ${active ? 'border-primary bg-primary' : 'border-border'}`}>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-end gap-1">
            <span className={`text-3xl font-bold tracking-tight ${active ? '' : 'text-foreground'}`}>
              ${plan.price.toFixed(2)}
            </span>
            <span className={`text-xs mb-1 ${active ? 'text-white/70' : 'text-muted'}`}>{plan.cadence}</span>
          </div>
          {plan.savings && (
            <p className={`text-[10px] mt-0.5 font-medium ${active ? 'text-emerald-300' : 'text-emerald-500'}`}>
              {plan.savings}
            </p>
          )}
          <p className={`text-xs mt-2 leading-relaxed line-clamp-2 ${active ? 'text-white/80' : 'text-muted'}`}>
            {plan.description}
          </p>

          {/* Quick feature highlight */}
          <div className={`mt-3 pt-3 border-t ${active ? 'border-white/20' : 'border-border'} space-y-1`}>
            {[
              'AI trigger analysis',
              'Predictive warnings',
              'Custom SOS flows',
              'Advanced analytics',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className={`w-3 h-3 shrink-0 ${active ? 'text-white/70' : 'text-primary'}`} />
                <span className={`truncate ${active ? 'text-white/70' : 'text-muted'}`}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('quarterly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout. Please try again later.');
      setIsLoading(false);
    }
  };

  const selectedPlanFull = useMemo(
    () => plans.find((p) => p.id === selectedPlan) || plans[1],
    [selectedPlan]
  );

  return (
    <div className="max-w-6xl mx-auto pb-24 px-1 md:px-2 relative">
      {/* Background animated orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-orbit-drift opacity-70" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px] animate-orbit-drift opacity-60" style={{ animationDelay: '-4s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-500/8 blur-[120px] animate-orbit-drift opacity-50" style={{ animationDelay: '-8s' }} />
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 pt-6 md:pt-10 relative">
        <div className="relative inline-flex">
          <div className="relative inline-flex items-center justify-center p-3 rounded-full mb-2 bg-gradient-to-br from-primary/20 via-indigo-500/20 to-accent/10 animate-float-drift">
            <Gem className="w-8 h-8 text-primary" />
            <SparkleEffect count={6} />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
            Unlock Your{' '}
            <span className="premium-glow-text">Full Recovery</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Core tools stay free forever. Premium unlocks personalized AI guidance,
            deeper risk prediction, and advanced coaching insights when you&apos;re ready to go further.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mt-10 grid lg:grid-cols-[1.35fr_0.9fr] gap-6 items-start">
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              active={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
              index={i}
            />
          ))}
        </div>

        {/* Selected Plan Summary */}
        <div className={`animate-stagger-4 rounded-2xl border-2 ${selectedPlanFull.borderColor} bg-gradient-to-b from-background to-primary/5 p-5 flex flex-col shadow-xl relative overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${selectedPlanFull.color} opacity-10 blur-[50px] animate-orbit-drift`} />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5" />
              Selected Plan
            </div>
            <h3 className="text-xl font-bold font-heading truncate">{selectedPlanFull.name}</h3>
            <p className="text-muted text-xs mt-0.5 leading-relaxed">{selectedPlanFull.description}</p>

            {selectedPlanFull.popular && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 text-[10px] font-bold">
                <Star className="w-2.5 h-2.5 fill-indigo-500" />
                Recommended — Best balance
              </div>
            )}

            <div className="my-4 rounded-xl bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/20 p-4">
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold mb-1">You pay</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">${selectedPlanFull.price.toFixed(2)}</span>
                <span className="text-sm text-muted mb-0.5">{selectedPlanFull.cadence}</span>
              </div>
              {selectedPlanFull.savings && (
                <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Save 30% vs monthly
                </p>
              )}
            </div>

            <div className="space-y-2 mb-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">What&apos;s included</p>
              <FeatureItem text="AI-powered trigger and risk analysis" premium />
              <FeatureItem text="Predictive relapse warnings" premium />
              <FeatureItem text="Custom SOS and guided reset flows" premium />
              <FeatureItem text="Advanced trends, timeline & export tools" premium />
              <FeatureItem text="Weekly AI coaching sessions" premium />
              <FeatureItem text="Cancel anytime, 14-day money-back guarantee" />
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="relative w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary via-indigo-600 to-primary bg-[length:200%_auto] animate-shimmer shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 truncate">
                {isLoading ? (
                  'Connecting...'
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Continue with {selectedPlanFull.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </>
                )}
              </span>
            </button>

            <p className="text-[9px] text-center text-muted mt-2">
              Secure checkout via Lemon Squeezy &bull; 14-day money-back guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl mx-auto mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Everything You Get With{' '}
            <span className="premium-glow-text">Premium</span>
          </h2>
          <p className="text-muted mt-1 text-sm md:text-base">Six powerful features designed to accelerate your recovery.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {premiumFeatures.map((feat, i) => (
            <div
              key={feat.title}
              className={`animate-stagger-${i + 1} group relative rounded-xl border border-border/60 bg-surface/50 p-4 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <feat.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-sm mb-0.5">{feat.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-5xl mx-auto mt-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Trusted by the <span className="premium-glow-text">Community</span>
          </h2>
          <p className="text-muted mt-0.5 text-xs md:text-sm">Real results from real members.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`animate-stagger-${i + 1} rounded-xl border border-border/60 bg-gradient-to-b from-surface/80 to-background p-4`}
            >
              <Quote className="w-4 h-4 text-primary/30 mb-2" />
              <p className="text-xs text-foreground leading-relaxed mb-3 italic line-clamp-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{t.name}</span>
                <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> {t.streak}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why upgrade section */}
      <div className="max-w-4xl mx-auto mt-16 rounded-2xl border border-border/60 bg-gradient-to-br from-surface/50 to-background p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-heading font-bold">Why Users Upgrade</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Clock,
              title: 'Earlier Intervention',
              desc: 'Get notified during your high-risk windows before urges peak.',
              color: 'from-primary/20 to-emerald-500/20',
              textColor: 'text-primary',
            },
            {
              icon: Target,
              title: 'Higher Consistency',
              desc: 'Use personalized recovery loops that adapt to your behavior over time.',
              color: 'from-indigo-500/20 to-purple-500/20',
              textColor: 'text-indigo-500',
            },
            {
              icon: Brain,
              title: 'More Clarity',
              desc: 'Understand what actually drives relapses with cleaner trend breakdowns.',
              color: 'from-amber-500/20 to-orange-500/20',
              textColor: 'text-amber-500',
            },
          ].map((item, i) => (
            <div key={i} className={`animate-stagger-${i + 1} text-center`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2`}>
                <item.icon className={`w-5 h-5 ${item.textColor}`} />
              </div>
              <h3 className="font-bold text-sm mb-0.5">{item.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ / Trust */}
      <div className="max-w-2xl mx-auto text-center space-y-4 pt-12 border-t border-border/60 mt-16">
        <Shield className="w-6 h-6 text-muted mx-auto" />
        <p className="text-sm text-muted leading-relaxed">
          Payment is securely processed by Lemon Squeezy, our Merchant of Record.
          We never store card details. You can cancel anytime — no questions asked.
        </p>
        <Link href="/refund" className="text-xs text-primary hover:text-primary-hover underline underline-offset-2 inline-flex items-center gap-1">
          Refund policy <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function FeatureItem({ text, premium = false }: { text: string; premium?: boolean }) {
  return (
    <div className="flex items-start gap-2 group">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${premium ? 'bg-primary/15 group-hover:bg-primary/25' : 'bg-muted/10'}`}>
        <CheckCircle2 className={`w-3 h-3 ${premium ? 'text-primary' : 'text-muted'}`} />
      </div>
      <span className={`text-xs leading-relaxed ${premium ? 'text-foreground' : 'text-muted'}`}>{text}</span>
    </div>
  );
}
