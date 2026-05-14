'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setIsLoading(false)
      return
    }

    try {
      const appUrl = (
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ||
        (process.env.NODE_ENV === 'production' ? 'https://stopgoon.vercel.app' : window.location.origin)
      ).replace(/\/$/, '')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback?next=/auth/success`,
        }
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Supabase returns an empty identities array if the email is already registered
      // (When 'Prevent Email Enumeration' is turned on in Supabase settings)
      if (data?.user?.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists. Please sign in instead.')
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      setIsLoading(false)
    } catch {
      setError('Could not connect to the server. Please check your internet connection and try again.')
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
        <div className="absolute top-16 -left-20 w-[340px] h-[340px] bg-primary/20 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-8 -right-16 w-[280px] h-[280px] bg-accent/15 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="w-full max-w-[420px] bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-10 shadow-xl relative z-10 animate-fade-up text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground mb-3">Check your email</h1>
          <p className="text-muted leading-relaxed mb-8">
            We&apos;ve sent a verification link to <strong>{email}</strong>. Please verify your account to continue.
          </p>
          <Link href="/login" className="block w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 transition-all font-bold shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]">
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      <div className="absolute top-16 -left-20 w-[340px] h-[340px] bg-primary/20 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-8 -right-16 w-[280px] h-[280px] bg-accent/15 blur-[80px] pointer-events-none rounded-full" />

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-stretch relative z-10">
        <div className="hidden md:flex flex-col justify-between rounded-3xl glass-card p-8 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-5">
              <Sparkles className="w-3.5 h-3.5" /> New user setup in 2 minutes
            </div>
            <h2 className="text-3xl font-heading font-bold mb-3">Start stronger, not stricter.</h2>
            <p className="text-muted leading-relaxed">Create your account and we will personalize your first plan with your exact triggers and recovery goals.</p>
          </div>
          <div className="space-y-3 text-sm font-medium text-foreground">
            <div className="flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-primary" /> Supportive, no-shame approach</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Privacy-first architecture</div>
            <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-primary" /> Guided onboarding right after signup</div>
          </div>
        </div>

        <div className="w-full bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-xl animate-fade-up-delay">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="bg-primary/10 p-4 rounded-2xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Create Account</h1>
          </Link>
          <p className="text-muted text-center text-sm">Start your recovery journey today. No judgment, just progress.</p>
        </div>

      <form onSubmit={handleSignUp} className="flex flex-col gap-5 text-foreground w-full">
        
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            className="rounded-xl px-4 py-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm w-full"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              className="w-full rounded-xl px-4 py-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm pr-12"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 ml-1">
              <div className="flex gap-1 mb-1">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${password.length >= 1 ? (password.length >= 8 ? 'bg-emerald-500' : password.length >= 6 ? 'bg-amber-500' : 'bg-red-500') : 'bg-border'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${password.length >= 6 ? (password.length >= 8 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-border'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${password.length >= 8 ? 'bg-emerald-500' : 'bg-border'}`} />
              </div>
              <p className={`text-xs font-medium ${password.length >= 8 ? 'text-emerald-500' : password.length >= 6 ? 'text-amber-500' : 'text-red-500'}`}>
                {password.length >= 8 ? 'Strong password' : password.length >= 6 ? 'Acceptable — try 8+ characters' : 'Too short — need at least 6 characters'}
              </p>
            </div>
          )}
          {password.length === 0 && (
            <p className="text-xs text-muted font-medium mt-1 ml-1">Must be at least 6 characters.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 mt-2 transition-all font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>Create Account <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <div className="mt-4 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
            Sign In instead
          </Link>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-background/70 p-3 text-xs text-muted text-center">
          Your account data is encrypted by default and your onboarding setup takes about 2 minutes.
        </div>
      </form>
        </div>
      </div>
    </div>
  )
}
