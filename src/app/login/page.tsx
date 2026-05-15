'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleIcon'
import GithubIcon from '@/components/GithubIcon'
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Check if onboarding is completed
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (profile && !profile.onboarding_completed) {
          router.push('/onboarding')
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/dashboard')
      }
      
      router.refresh()
    } catch {
      setError('Could not connect to the server. Please check your internet connection and try again.')
      setIsLoading(false)
    }
  }

  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
    } catch {
      setError('Could not connect to the provider.')
    }
    setIsLoading(false)
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Enter your email address first.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })
      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }
      setMagicLinkSent(true)
    } catch {
      setError('Could not send magic link.')
    }
    setIsLoading(false)
  }

  if (magicLinkSent) {
    return (
      <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-10 shadow-xl text-center animate-fade-up">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground mb-3">Check your email</h1>
          <p className="text-muted leading-relaxed mb-8">
            We sent a magic link to <strong>{email}</strong>. Click it to sign in instantly.
          </p>
          <button onClick={() => setMagicLinkSent(false)} className="text-sm text-primary hover:text-primary-hover font-semibold">
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4 py-10 relative overflow-hidden">


      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-stretch relative z-10">
        <div className="hidden md:flex flex-col justify-between rounded-3xl glass-card p-8 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Trusted recovery platform
            </div>
            <h2 className="text-3xl font-heading font-bold mb-3">Welcome back to focused living.</h2>
            <p className="text-muted leading-relaxed">Pick up exactly where you left off, with your check-ins, trigger map, and recovery plan ready in one place.</p>
          </div>
          <div className="space-y-3 text-sm font-medium text-foreground">
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> End-to-end encrypted data</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> No public profile required</div>
            <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-primary" /> Back to your dashboard in seconds</div>
          </div>
        </div>

        <div className="w-full bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-xl animate-fade-up-delay">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="bg-primary/10 p-4 rounded-2xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Welcome Back</h1>
          </Link>
          <p className="text-muted text-center text-sm">Log in to continue your momentum.</p>
        </div>

      <form onSubmit={handleSignIn} className="flex flex-col gap-5 text-foreground w-full">
        
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-background border border-border hover:bg-surface-hover rounded-xl px-4 py-3.5 font-medium text-sm transition-colors disabled:opacity-60"
          >
            <GoogleIcon /> Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-background border border-border hover:bg-surface-hover rounded-xl px-4 py-3.5 font-medium text-sm transition-colors disabled:opacity-60"
          >
            <GithubIcon /> Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-medium text-muted">or sign in with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

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
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-foreground" htmlFor="password">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
              Forgot password?
            </Link>
          </div>
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
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 transition-all font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <button
          type="button"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="w-full text-center text-sm font-semibold text-muted hover:text-foreground transition-colors py-2"
        >
          Send magic link instead
        </button>

        <div className="text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
            Register instead
          </Link>
        </div>
      </form>
        </div>
      </div>
    </div>
  )
}
