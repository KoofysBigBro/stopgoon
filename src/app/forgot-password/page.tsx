'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ShieldCheck, Loader2, MailCheck, ArrowLeft, ArrowRight, Sparkles, Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email) {
      setError('Please enter your email address.')
      setIsLoading(false)
      return
    }

    try {
      const appUrl = (
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ||
        (process.env.NODE_ENV === 'production' ? 'https://stopgoon.xyz' : window.location.origin)
      ).replace(/\/$/, '')
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/callback?next=/update-password`,
      })

      if (error) {
        setError(error.message)
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
      <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
        <div className="absolute top-16 -left-20 w-[340px] h-[340px] bg-primary/20 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-8 -right-16 w-[280px] h-[280px] bg-accent/15 blur-[80px] pointer-events-none rounded-full" />

        <div className="w-full max-w-sm bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-10 shadow-xl relative z-10 animate-fade-up text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <MailCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground mb-3">Check your email</h1>
          <p className="text-muted leading-relaxed mb-8">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
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
              <Sparkles className="w-3.5 h-3.5" /> Reset in under a minute
            </div>
            <h2 className="text-3xl font-heading font-bold mb-3">Get back on track quickly.</h2>
            <p className="text-muted leading-relaxed">We will send you a secure recovery link so you can set a new password and keep your progress moving.</p>
          </div>
          <div className="space-y-3 text-sm font-medium text-foreground">
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Private account recovery</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Encrypted auth flow</div>
            <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-primary" /> New password in a few taps</div>
          </div>
        </div>

        <div className="w-full bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-xl animate-fade-up-delay relative">
          <Link href="/login" className="absolute top-5 left-5 flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <div className="flex flex-col items-center mb-8 gap-3 pt-8">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Reset Password</h1>
            <p className="text-muted text-center text-sm">Enter your email and we&apos;ll send you a secure reset link.</p>
          </div>

          <form onSubmit={handleReset} className="flex flex-col gap-5 text-foreground w-full">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 mt-2 transition-all font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="mt-2 rounded-xl border border-border bg-background/70 p-3 text-xs text-muted text-center">
              Use the same email you signed up with. The reset link expires for security.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
