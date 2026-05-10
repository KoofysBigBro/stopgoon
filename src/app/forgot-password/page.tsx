'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ShieldCheck, Loader2, MailCheck, ArrowLeft } from 'lucide-react'

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard/settings`,
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
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-6 min-h-screen mx-auto text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <MailCheck className="w-16 h-16 text-indigo-500 mx-auto" />
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-slate-500 dark:text-slate-400">
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link href="/login" className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 mt-4 transition-all font-semibold shadow-sm">
          Return to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen mx-auto text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-900">
      
      <Link href="/login" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <div className="flex flex-col items-center mb-8 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold mt-2">Reset Password</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleReset} className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground animate-in fade-in zoom-in duration-500 delay-150 fill-mode-both">
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            className="rounded-xl px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3.5 mt-2 transition-all font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </div>
  )
}
