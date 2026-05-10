import Link from 'next/link'
import { ShieldCheck, Heart, Lock, TrendingUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="bg-primary/10 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground font-heading">Reclaim</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-32 px-6 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] pointer-events-none rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Your private space for recovery
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] font-heading">
            Break the cycle. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Reclaim your focus.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Reclaim is a mature, scientifically-grounded platform designed to help you overcome compulsive habits and doomscrolling through mindfulness, non-punitive tracking, and accessible design.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-primary/20">
            Start Your Journey Today
          </Link>
        </section>

        {/* Features Grid */}
        <section className="py-32 bg-surface border-y border-border px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading tracking-tight">Built for lasting change.</h2>
              <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">We don't believe in toxic productivity or shame. Our tools are designed to support you gently, even when you stumble.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-10 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8">
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-heading text-foreground">Non-Punitive Tracking</h3>
                <p className="text-muted leading-relaxed text-[15px]">
                  Traditional streaks cause shame upon relapse. We focus on days of growth and overall milestones, celebrating the journey instead of punishing the setbacks.
                </p>
              </div>
              <div className="p-10 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8">
                  <Lock className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-heading text-foreground">Private & Secure</h3>
                <p className="text-muted leading-relaxed text-[15px]">
                  Your recovery data is yours. Hosted securely with enterprise-grade PostgreSQL encryption, ensuring your journey remains completely private.
                </p>
              </div>
              <div className="p-10 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8">
                  <TrendingUp className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-heading text-foreground">Insights & Journaling</h3>
                <p className="text-muted leading-relaxed text-[15px]">
                  Identify triggers through detailed urge logging and structured relapse reflections. Understand your behavior to rebuild healthier habits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-muted text-sm bg-background">
        <p>© {new Date().getFullYear()} Reclaim. All rights reserved.</p>
      </footer>
    </div>
  )
}
