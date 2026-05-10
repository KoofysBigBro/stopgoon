import Link from 'next/link'
import { ShieldCheck, Heart, Lock, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StopGoon</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Your private space for recovery
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Break the cycle. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Reclaim your focus.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            StopGoon is a mature, scientifically-grounded platform designed to help you overcome compulsive habits and doomscrolling through mindfulness, non-punitive tracking, and accessible design.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-600/20">
            Start Your Journey Today
          </Link>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for lasting change.</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">We don&apos;t believe in toxic productivity or shame. Our tools are designed to support you gently, even when you stumble.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <Heart className="w-10 h-10 text-rose-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Non-Punitive Tracking</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Traditional streaks cause shame upon relapse. We focus on days of growth and overall milestones, celebrating the journey instead of punishing the setbacks.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <Lock className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Private & Secure</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your recovery data is yours. Hosted securely with enterprise-grade PostgreSQL encryption, ensuring your journey remains completely private.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <TrendingUp className="w-10 h-10 text-indigo-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Insights & Journaling</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Identify triggers through detailed urge logging and structured relapse reflections. Understand your behavior to rebuild healthier habits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-slate-500 dark:text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} StopGoon. All rights reserved.</p>
      </footer>
    </div>
  )
}
