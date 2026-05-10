'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
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
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-slate-500 dark:text-slate-400">
          We&apos;ve sent a verification link to <strong>{email}</strong>. Please verify your account to continue.
        </p>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3.5 mt-4 transition-all font-semibold shadow-md shadow-indigo-600/20">
          Return to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen mx-auto text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex flex-col items-center mb-8 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="flex flex-col items-center gap-2 group">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold mt-2">Register</h1>
        </Link>
        <p className="text-slate-500 dark:text-slate-400 text-center">Start your recovery journey today. No judgement, just progress.</p>
      </div>

      <form onSubmit={handleSignUp} className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground animate-in fade-in zoom-in duration-500 delay-150 fill-mode-both">
        
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

        <div className="flex flex-col gap-1.5 mb-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              className="w-full rounded-xl px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm pr-12"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 ml-1">
              <div className="flex gap-1 mb-1">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${password.length >= 1 ? (password.length >= 8 ? 'bg-emerald-500' : password.length >= 6 ? 'bg-amber-500' : 'bg-red-400') : 'bg-slate-200 dark:bg-slate-700'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${password.length >= 6 ? (password.length >= 8 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200 dark:bg-slate-700'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${password.length >= 8 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
              </div>
              <p className={`text-xs ${password.length >= 8 ? 'text-emerald-600 dark:text-emerald-400' : password.length >= 6 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'}`}>
                {password.length >= 8 ? 'Strong password' : password.length >= 6 ? 'Acceptable — try 8+ characters' : 'Too short — need at least 6 characters'}
              </p>
            </div>
          )}
          {password.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-1">Must be at least 6 characters.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3.5 mt-2 transition-all font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In instead
          </Link>
        </div>
      </form>
    </div>
  )
}
