'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react'

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

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-[420px] bg-surface/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="bg-primary/10 p-4 rounded-2xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Welcome Back</h1>
          </Link>
          <p className="text-muted text-center text-sm">Log in to continue your recovery journey.</p>
        </div>

      <form onSubmit={handleSignIn} className="flex flex-col gap-5 text-foreground w-full">
        
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
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 mt-2 transition-all font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="mt-4 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
            Register instead
          </Link>
        </div>
      </form>
      </div>
    </div>
  )
}
