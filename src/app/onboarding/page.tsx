'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Moon, Clock, Smartphone, Coffee, Target, Sparkles } from 'lucide-react'

const TRIGGERS = [
  { id: 'boredom', label: 'Boredom', icon: Clock },
  { id: 'stress', label: 'Stress / Anxiety', icon: Coffee },
  { id: 'late_night', label: 'Late at Night', icon: Moon },
  { id: 'doomscrolling', label: 'Doomscrolling', icon: Smartphone },
  { id: 'loneliness', label: 'Loneliness', icon: Target },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [reason, setReason] = useState('')
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showFirstWin, setShowFirstWin] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [router, supabase])

  const toggleTrigger = (id: string) => {
    if (selectedTriggers.includes(id)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== id))
    } else {
      setSelectedTriggers([...selectedTriggers, id])
    }
  }

  const handleFinish = async () => {
    if (!user) return
    setIsLoading(true)

    // Save to users table
    await supabase.from('users').update({
      reasons_to_quit: reason.trim() ? [reason.trim()] : [],
      primary_triggers: selectedTriggers,
      onboarding_completed: true
    }).eq('id', user.id)

    setShowFirstWin(true)
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1200)
  }

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-8 -left-20 w-[320px] h-[320px] bg-primary/20 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-6 -right-10 w-[280px] h-[280px] bg-accent/15 blur-[80px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-2xl z-10">
        <div className="flex items-center justify-center gap-2 mb-12">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="font-bold tracking-tight text-foreground">StopGoon</span>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Personalized setup
          </div>

          <div className="mb-6 rounded-xl border border-border bg-background/70 p-3 text-xs text-muted flex items-center justify-between">
            <span>Estimated setup time: about 60 seconds</span>
            <span className="font-semibold text-foreground">Step {step} of 2</span>
          </div>

          <div className="flex gap-2 mb-12">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-bold font-heading mb-4 text-foreground">What is your primary goal?</h1>
              <p className="text-muted mb-8 leading-relaxed">
                Defining your &quot;why&quot; is the first step in rewiring your habits. Write down the reason that matters most to you.
              </p>
              
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. I want to regain my attention span, reduce my brain fog, and build a healthier lifestyle."
                className="w-full bg-background border border-border rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none mb-8"
              />

              <button
                onClick={() => setStep(2)}
                disabled={!reason.trim()}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-xl px-4 py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && !showFirstWin && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-bold font-heading mb-4 text-foreground">Identify your triggers</h1>
              <p className="text-muted mb-8 leading-relaxed">
                When are you most likely to fall back into old habits? Select the triggers that affect you the most so we can personalize your recovery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {TRIGGERS.map((trigger) => {
                  const Icon = trigger.icon
                  const isSelected = selectedTriggers.includes(trigger.id)
                  return (
                    <button
                      key={trigger.id}
                      onClick={() => toggleTrigger(trigger.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-foreground shadow-sm' 
                          : 'border-border bg-background hover:border-primary/30 text-muted hover:text-foreground'
                       }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                      <span className="font-semibold">{trigger.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto text-primary" />}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-xl font-bold text-muted hover:text-foreground bg-background border border-border transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={selectedTriggers.length === 0 || isLoading}
                  className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-xl px-4 py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}

          {showFirstWin && (
            <div className="text-center py-10 animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">First win unlocked</h2>
              <p className="text-muted">Your personalized reset plan is ready. Loading your dashboard...</p>
            </div>
          )}

        </div>
        
        <p className="text-center text-sm text-muted mt-8 flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4" /> Your responses are private and encrypted.
        </p>
      </div>
    </div>
  )
}
