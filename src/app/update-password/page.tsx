'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      <div className="absolute top-16 -left-20 w-[340px] h-[340px] bg-primary/20 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-8 -right-16 w-[280px] h-[280px] bg-accent/15 blur-[80px] pointer-events-none rounded-full" />

      <div className="w-full max-w-sm bg-surface/70 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-xl relative z-10 animate-fade-up">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Set New Password</h1>
          <p className="text-muted text-center text-sm">Please enter your new secure password below.</p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-5 text-foreground w-full">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                className="w-full rounded-xl px-4 py-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm pr-12"
                type={showPassword ? 'text' : 'password'}
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-4 py-4 mt-2 transition-all font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>Update Password <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
