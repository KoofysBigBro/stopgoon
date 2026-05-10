'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Moon, Clock, Smartphone, Coffee, Target } from 'lucide-react'

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
  const [user, setUser] = useState<any>(null)
  
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

    // Redirect to dashboard
    router.push('/dashboard')
    router.refresh()
  }

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-xl z-10">
        <div className="flex items-center justify-center gap-2 mb-12">
          <ShieldCheck className="w-6 h-6 text-indigo-500" />
          <span className="font-bold tracking-tight text-foreground">StopGoon</span>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-500/5">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-bold font-heading mb-4 text-foreground">What is your primary goal?</h1>
              <p className="text-muted mb-8 leading-relaxed">
                Defining your "Why" is the first step in rewiring your brain. Write down the main reason you want to break your digital habits.
              </p>
              
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. I want to regain my attention span, reduce my brain fog, and build a healthier lifestyle."
                className="w-full bg-background border border-border rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none mb-8"
              />

              <button
                onClick={() => setStep(2)}
                disabled={!reason.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-xl px-4 py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
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
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                          : 'border-border bg-background hover:border-indigo-500/30 text-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} />
                      <span className="font-semibold">{trigger.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto text-indigo-500" />}
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
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-xl px-4 py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
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
