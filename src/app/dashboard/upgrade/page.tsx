"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  CheckCircle2, Shield, Sparkles, Star,   Crown, ArrowRight,
  TrendingUp, Brain, Heart, Zap, Activity, Target,
  ChevronRight, Quote, BarChart3, Clock, Gem, AlertTriangle, CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import SparkleEffect from '@/components/premium/SparkleEffect';
import SectionCard from '../components/ui/SectionCard';
import { createClient } from '@/utils/supabase/client';

type PlanId = 'monthly' | 'quarterly' | 'yearly';

type PersonalizedStats = {
  streakDays: number;
  recentUrgeAvg: number | null;
  urgeTrend: 'up' | 'down' | 'flat';
  consistency: number;
  riskWindow: string | null;
};

type FunnelSnapshot = {
  viewed: number;
  selected: number;
  started: number;
  errored: number;
  completed: number;
};

function trackEvent(name: string, data?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  const va = (window as Window & { va?: (event: string, payload?: { name: string; data?: Record<string, string | number | boolean> }) => void }).va;
  if (typeof va === 'function') {
    va('event', { name, data });
  }

  void fetch('/api/analytics/upgrade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data }),
  }).catch(() => undefined);
}

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
              €{plan.price.toFixed(2)}
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
  const supabase = createClient();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('quarterly');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [stats, setStats] = useState<PersonalizedStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [funnel, setFunnel] = useState<FunnelSnapshot | null>(null);

  useEffect(() => {
    trackEvent('upgrade_page_viewed');
  }, []);

  useEffect(() => {
    trackEvent('upgrade_plan_selected', { plan: selectedPlan });
  }, [selectedPlan]);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setCheckoutError(null);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      trackEvent('upgrade_checkout_started', { plan: selectedPlan });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      window.location.href = data.url;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error(err);
      trackEvent('upgrade_checkout_error', { plan: selectedPlan });
      setCheckoutError('Could not start checkout. Please try again in a few seconds.');
      setIsLoading(false);
    }
  };

  const selectedPlanFull = useMemo(
    () => plans.find((p) => p.id === selectedPlan) || plans[1],
    [selectedPlan]
  );

  const urgeTrendText = useMemo(() => {
    if (loadingStats) return 'Loading your trend...';
    if (!stats || stats.recentUrgeAvg === null) return 'Not enough urge data yet';
    return `Last 7 days avg intensity: ${stats.recentUrgeAvg}/10 (${stats.urgeTrend})`;
  }, [loadingStats, stats]);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setLoadingStats(false);
        return;
      }

      const [{ data: relapses }, { data: checkins }, { data: urges }] = await Promise.all([
        supabase.from('relapses').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('daily_checkins').select('created_at').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('urge_logs').select('intensity, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      ]);

      const { data: funnelEvents } = await supabase
        .from('upgrade_funnel_events')
        .select('event_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      const lastRelapseDate = relapses && relapses.length > 0 ? new Date(relapses[0].created_at) : new Date(user.created_at);
      const streakDays = (checkins || []).filter((c) => new Date(c.created_at) >= lastRelapseDate).length;

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      const uniqueRecentDays = new Set(
        (checkins || [])
          .filter((c) => new Date(c.created_at) >= sevenDaysAgo)
          .map((c) => new Date(c.created_at).toISOString().slice(0, 10))
      ).size;
      const consistency = Math.round((uniqueRecentDays / 7) * 100);

      const recentUrges = (urges || []).filter((u) => new Date(u.created_at) >= sevenDaysAgo);
      const priorStart = new Date(sevenDaysAgo);
      priorStart.setDate(priorStart.getDate() - 7);
      const priorUrges = (urges || []).filter((u) => {
        const time = new Date(u.created_at);
        return time >= priorStart && time < sevenDaysAgo;
      });

      const avg = (items: Array<{ intensity: number | null }>) => {
        if (!items.length) return null;
        const sum = items.reduce((acc, u) => acc + (u.intensity || 0), 0);
        return Math.round((sum / items.length) * 10) / 10;
      };

      const hourBuckets = new Array<number>(24).fill(0);
      (urges || []).forEach((u) => {
        const hour = new Date(u.created_at).getHours();
        hourBuckets[hour] += 1;
      });
      const maxCount = Math.max(...hourBuckets);
      const hotspotHour = maxCount > 1 ? hourBuckets.findIndex((count) => count === maxCount) : -1;
      const riskWindow = hotspotHour >= 0
        ? `${String(hotspotHour).padStart(2, '0')}:00 - ${String((hotspotHour + 2) % 24).padStart(2, '0')}:00`
        : null;

      const recentAvg = avg(recentUrges);
      const priorAvg = avg(priorUrges);
      let urgeTrend: 'up' | 'down' | 'flat' = 'flat';
      if (recentAvg !== null && priorAvg !== null) {
        if (recentAvg > priorAvg + 0.4) urgeTrend = 'up';
        else if (recentAvg < priorAvg - 0.4) urgeTrend = 'down';
      }

      setStats({
        streakDays,
        recentUrgeAvg: recentAvg,
        urgeTrend,
        consistency,
        riskWindow,
      });

      const events = funnelEvents || [];
      setFunnel({
        viewed: events.filter((e) => e.event_name === 'upgrade_page_viewed').length,
        selected: events.filter((e) => e.event_name === 'upgrade_plan_selected').length,
        started: events.filter((e) => e.event_name === 'upgrade_checkout_started').length,
        errored: events.filter((e) => e.event_name === 'upgrade_checkout_error').length,
        completed: events.filter((e) => e.event_name === 'upgrade_checkout_completed').length,
      });

      setLoadingStats(false);
    };

    void loadStats();
  }, [supabase]);

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
            Upgrade For{' '}
            <span className="premium-glow-text">Better Outcomes</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Free gives you core tracking. Premium gives you earlier intervention, clearer relapse patterns,
            and personalized coaching when risk is rising.
          </p>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/60 bg-surface/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Risk window clarity</p>
          <p className="text-sm text-foreground">Identify your highest-risk hours and get warnings before urges peak.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Intervention speed</p>
          <p className="text-sm text-foreground">Trigger SOS, coaching, and reset routines faster when a spike starts.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Weekly momentum</p>
          <p className="text-sm text-foreground">Turn your raw check-ins into a focused weekly plan you can actually execute.</p>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/90 mb-1">Your current streak</p>
          <p className="text-2xl font-bold">{loadingStats ? '...' : `${stats?.streakDays ?? 0} days`}</p>
        </div>
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">7-day consistency</p>
          <p className="text-2xl font-bold">{loadingStats ? '...' : `${stats?.consistency ?? 0}%`}</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">Urge trend</p>
          <p className="text-sm font-semibold">{urgeTrendText}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/10 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-200 mb-1">Estimated high-risk window</p>
        <p className="text-sm text-rose-50/90">
          {loadingStats
            ? 'Calculating from your recent urge logs...'
            : stats?.riskWindow
              ? `${stats.riskWindow} appears to be your most vulnerable period. Premium helps you intervene earlier.`
              : 'Log a few urge events to reveal your highest-risk time window.'}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-border/60 bg-surface/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Your recent upgrade activity</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="rounded-lg border border-border bg-background/70 p-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted">Viewed</p>
            <p className="text-lg font-bold">{loadingStats ? '...' : (funnel?.viewed ?? 0)}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 p-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted">Plan Picks</p>
            <p className="text-lg font-bold">{loadingStats ? '...' : (funnel?.selected ?? 0)}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 p-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted">Checkout</p>
            <p className="text-lg font-bold">{loadingStats ? '...' : (funnel?.started ?? 0)}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 p-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted">Errors</p>
            <p className="text-lg font-bold">{loadingStats ? '...' : (funnel?.errored ?? 0)}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200">Completed</p>
            <p className="text-lg font-bold">{loadingStats ? '...' : (funnel?.completed ?? 0)}</p>
          </div>
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
                <span className="text-3xl font-bold">€{selectedPlanFull.price.toFixed(2)}</span>
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

            {checkoutError ? <p className="mt-2 text-center text-xs text-red-400">{checkoutError}</p> : null}

            <p className="text-[9px] text-center text-muted mt-2">
              Secure checkout via Lemon Squeezy &bull; 14-day money-back guarantee
            </p>

            <div className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 mb-1">Recommended next step</p>
              <p className="text-xs text-emerald-100/90">Start with {selectedPlanFull.shortName} and run your first 7-day recovery loop with AI guidance.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 rounded-2xl border border-border/60 bg-gradient-to-br from-background to-surface/50 p-6">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-heading font-bold">What Changes After Upgrading</h2>
          <p className="text-sm text-muted mt-1">Premium is designed to improve decisions under pressure, not just add dashboards.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold mb-2"><AlertTriangle className="w-3.5 h-3.5" /> BEFORE</div>
            <p className="text-xs text-muted">You notice patterns after a relapse.</p>
          </div>
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
            <div className="inline-flex items-center gap-1 text-primary text-xs font-bold mb-2"><CheckCheck className="w-3.5 h-3.5" /> AFTER</div>
            <p className="text-xs text-foreground">You get warnings during risk windows and act earlier with SOS + coaching.</p>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="inline-flex items-center gap-1 text-indigo-400 text-xs font-bold mb-2"><TrendingUp className="w-3.5 h-3.5" /> RESULT</div>
            <p className="text-xs text-muted">More consistent check-ins, faster recovery after spikes, stronger streak stability.</p>
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
          <p className="text-muted mt-0.5 text-xs md:text-sm">Reported wins from members using premium routines.</p>
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
      <SectionCard className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-surface/50 to-background p-6 md:p-8 border-border/60">
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
      </SectionCard>

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
        <p className="text-[11px] text-muted">Need help before buying? Start with free tools and upgrade anytime from Settings.</p>
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
