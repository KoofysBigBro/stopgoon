'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, GripVertical, Play, Pause, SkipForward, Timer, Pencil, RotateCcw, CheckCircle2, Sparkles, Crown } from 'lucide-react'
import Link from 'next/link'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import PrimaryButton from '../components/ui/PrimaryButton'

interface RoutineStep {
  id: string;
  type: 'breathe' | 'hold' | 'action' | 'affirmation' | 'timer';
  label: string;
  duration: number; // seconds
}

interface Routine {
  id: string;
  name: string;
  steps: RoutineStep[];
  is_default: boolean;
}

export default function SOSPage() {
  const supabase = createClient()
  const [isBreathing, setIsBreathing] = useState(false)
  const [breatheText, setBreatheText] = useState('Ready')
  const [scale, setScale] = useState(0.5)
  const [color, setColor] = useState('bg-primary')

  // Custom routines
  const [isPremium, setIsPremium] = useState(false)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [routineName, setRoutineName] = useState('')
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>([])

  // Active routine player
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepTimeLeft, setStepTimeLeft] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [routineComplete, setRoutineComplete] = useState(false)

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('users').select('subscription_tier').eq('id', user.id).single()
    setIsPremium(profile?.subscription_tier === 'premium')

    const { data: routineData } = await supabase
      .from('sos_routines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    
    if (routineData) {
      setRoutines(routineData.map(r => ({ ...r, steps: r.steps as RoutineStep[] })))
    }
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [loadData])

  const handleBreathingToggle = () => {
    if (isBreathing) {
      setBreatheText('Ready')
      setScale(0.5)
      setColor('bg-primary')
    }
    setIsBreathing(prev => !prev)
  }

  // Box breathing effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    const timeouts: NodeJS.Timeout[] = []

    if (isBreathing) {
      const cycle = () => {
        setBreatheText('Inhale')
        setScale(1)
        setColor('bg-primary/40 shadow-[0_0_80px_rgba(139,92,246,0.6)]')

        timeouts.push(setTimeout(() => {
          setBreatheText('Hold')
          setColor('bg-primary/60 shadow-[0_0_100px_rgba(139,92,246,0.8)]')
        }, 4000))

        timeouts.push(setTimeout(() => {
          setBreatheText('Exhale')
          setScale(0.5)
          setColor('bg-primary/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]')
        }, 8000))

        timeouts.push(setTimeout(() => {
          setBreatheText('Hold')
          setColor('bg-transparent border border-primary/30 shadow-none')
        }, 12000))
      }

      cycle()
      interval = setInterval(cycle, 16000)
    }

    return () => {
      clearInterval(interval)
      timeouts.forEach(clearTimeout)
    }
  }, [isBreathing])

  // Routine player timer
  useEffect(() => {
    if (!isPlaying || !activeRoutine || routineComplete) return

    const timer = setInterval(() => {
      setStepTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next step
          if (currentStepIndex < activeRoutine.steps.length - 1) {
            const nextIdx = currentStepIndex + 1
            setCurrentStepIndex(nextIdx)
            return activeRoutine.steps[nextIdx].duration
          } else {
            setIsPlaying(false)
            setRoutineComplete(true)
            clearInterval(timer)
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, currentStepIndex, activeRoutine, routineComplete])

  const startRoutine = (routine: Routine) => {
    if (routine.steps.length === 0) return
    setActiveRoutine(routine)
    setCurrentStepIndex(0)
    setStepTimeLeft(routine.steps[0].duration)
    setIsPlaying(true)
    setRoutineComplete(false)
  }

  const skipStep = () => {
    if (!activeRoutine) return
    if (currentStepIndex < activeRoutine.steps.length - 1) {
      const nextIdx = currentStepIndex + 1
      setCurrentStepIndex(nextIdx)
      setStepTimeLeft(activeRoutine.steps[nextIdx].duration)
    } else {
      setIsPlaying(false)
      setRoutineComplete(true)
    }
  }

  const stopRoutine = () => {
    setActiveRoutine(null)
    setIsPlaying(false)
    setRoutineComplete(false)
    setCurrentStepIndex(0)
  }

  // Builder functions
  const addStep = (type: RoutineStep['type']) => {
    const labels: Record<string, string> = {
      breathe: 'Deep breath in and out',
      hold: 'Hold your breath',
      action: 'Do 10 pushups',
      affirmation: 'I am in control of my choices',
      timer: 'Close your eyes and wait'
    }
    const durations: Record<string, number> = {
      breathe: 8, hold: 4, action: 30, affirmation: 10, timer: 15
    }
    setRoutineSteps(prev => [...prev, {
      id: crypto.randomUUID(),
      type,
      label: labels[type],
      duration: durations[type]
    }])
  }

  const removeStep = (id: string) => {
    setRoutineSteps(prev => prev.filter(s => s.id !== id))
  }

  const updateStep = (id: string, field: keyof RoutineStep, value: string | number) => {
    setRoutineSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const saveRoutine = async () => {
    if (!routineName.trim() || routineSteps.length === 0) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let result;
    if (editingRoutine) {
      result = await supabase.from('sos_routines').update({
        name: routineName.trim(),
        steps: routineSteps
      }).eq('id', editingRoutine.id)
    } else {
      result = await supabase.from('sos_routines').insert({
        user_id: user.id,
        name: routineName.trim(),
        steps: routineSteps
      })
    }

    if (result.error) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to save routine:', result.error)
      return
    }

    setShowBuilder(false)
    setEditingRoutine(null)
    setRoutineName('')
    setRoutineSteps([])
    loadData()
  }

  const deleteRoutine = async (id: string) => {
    if (!confirm('Delete this routine?')) return
    await supabase.from('sos_routines').delete().eq('id', id)
    loadData()
  }

  const editRoutine = (routine: Routine) => {
    setEditingRoutine(routine)
    setRoutineName(routine.name)
    setRoutineSteps([...routine.steps])
    setShowBuilder(true)
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'breathe': return '🌬️'
      case 'hold': return '⏸️'
      case 'action': return '💪'
      case 'affirmation': return '💭'
      case 'timer': return '⏱️'
      default: return '▶️'
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case 'breathe': return 'bg-sky-500/15 border-sky-500/30 text-sky-400'
      case 'hold': return 'bg-amber-500/15 border-amber-500/30 text-amber-400'
      case 'action': return 'bg-accent/15 border-accent/30 text-accent'
      case 'affirmation': return 'bg-primary/15 border-primary/30 text-primary'
      case 'timer': return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
      default: return 'bg-surface border-border'
    }
  }

  const currentStep = activeRoutine?.steps[currentStepIndex]

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      <PageHeader
        title="Emergency Mode"
        subtitle="Breathe. This urge is temporary. You are safe."
      />

      {/* Active Routine Player */}
      {activeRoutine && (
        <div className="glass-card border-2 border-primary/30 rounded-3xl p-8 text-center shadow-lg shadow-primary/20 mb-8 animate-fade-up-delay">
          <h2 className="text-lg font-bold text-muted mb-1">{activeRoutine.name}</h2>
          
          {routineComplete ? (
            <div className="py-8">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-2xl font-bold text-primary mb-2">Routine Complete!</p>
              <p className="text-muted mb-6">You did it. The urge doesn&apos;t control you.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => startRoutine(activeRoutine)} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Repeat
                </button>
                <button onClick={stopRoutine} className="px-6 py-3 bg-surface-hover hover:bg-border text-foreground rounded-xl font-bold transition-colors">
                  Close
                </button>
              </div>
            </div>
          ) : currentStep && (
            <>
              <p className="text-sm text-muted mb-6">Step {currentStepIndex + 1} of {activeRoutine.steps.length}</p>
              
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${getStepColor(currentStep.type)} border-2`}>
                <div className="text-center">
                  <p className="text-3xl mb-1">{getStepIcon(currentStep.type)}</p>
                  <p className="text-3xl font-bold">{stepTimeLeft}s</p>
                </div>
              </div>

              <p className="text-xl font-bold mb-2">{currentStep.label}</p>
              <p className="text-sm text-muted capitalize mb-6">{currentStep.type} • {currentStep.duration}s</p>

              {/* Progress bar */}
              <div className="w-full bg-background rounded-full h-2 mb-6 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${((currentStep.duration - stepTimeLeft) / currentStep.duration) * 100}%` }}
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  {isPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
                </button>
                <button onClick={skipStep} className="px-6 py-3 bg-surface-hover hover:bg-border text-foreground rounded-xl font-bold transition-colors flex items-center gap-2">
                  <SkipForward className="w-4 h-4" /> Skip
                </button>
                <button onClick={stopRoutine} className="px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold transition-colors text-sm">
                  Stop
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Box Breathing - modern Apple Watch style */}
      {!activeRoutine && (
        <div className="glass-card rounded-[2.5rem] p-10 md:p-14 text-center mb-8 relative overflow-hidden border border-border/40">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-foreground">Box Breathing</h2>
            <p className="text-muted mb-16 font-medium">Follow the circle to regulate your nervous system.</p>
            
            <div className="relative w-64 h-64 mx-auto mb-16 flex items-center justify-center">
              
              {/* Outer guide ring */}
              <div className="absolute inset-0 rounded-full border border-border/30" />
              
              {/* Expanding Breathe Ring */}
              <div 
                className={`absolute inset-0 rounded-full flex items-center justify-center mix-blend-screen transition-all duration-[4000ms] ease-in-out ${color}`}
                style={{ 
                  transform: `scale(${scale})`, 
                }}
              >
                {/* Inner core glow */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
              </div>

              {/* Text Center */}
              <div className="relative z-20 text-3xl font-bold text-white tracking-widest uppercase drop-shadow-md">
                {breatheText}
              </div>
            </div>
            
            <button
              onClick={handleBreathingToggle}
              className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                isBreathing 
                  ? 'bg-surface border border-border text-foreground hover:bg-surface-hover shadow-none' 
                  : 'bg-primary hover:bg-primary-hover text-white shadow-primary/25'
              }`}
            >
              {isBreathing ? 'Stop Exercise' : 'Start Exercise'}
            </button>
          </div>
        </div>
      )}

      {/* Grounding & Distractions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-[2rem] p-8 border border-border/40">
          <h3 className="text-xl font-bold mb-5 tracking-tight text-foreground">Grounding (5-4-3-2-1)</h3>
          <p className="mb-6 text-sm text-muted font-medium">Acknowledge your surroundings:</p>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border/50 text-xl">👀</div> <span><strong className="text-primary mr-1">5</strong> things you can see</span></li>
            <li className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border/50 text-xl">🖐️</div> <span><strong className="text-primary mr-1">4</strong> things you can touch</span></li>
            <li className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border/50 text-xl">👂</div> <span><strong className="text-primary mr-1">3</strong> things you can hear</span></li>
            <li className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border/50 text-xl">👃</div> <span><strong className="text-primary mr-1">2</strong> things you can smell</span></li>
            <li className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border/50 text-xl">👅</div> <span><strong className="text-primary mr-1">1</strong> thing you can taste</span></li>
          </ul>
        </div>

        <div className="glass-card rounded-[2rem] p-8 border border-border/40">
          <h3 className="text-xl font-bold mb-5 tracking-tight text-foreground">Distraction Activities</h3>
          <ul className="space-y-4 text-sm font-medium mt-10">
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/50" /> Drink a large glass of cold water</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/50" /> Do 10 pushups or jumping jacks</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/50" /> Splash cold water on your face</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/50" /> Text a friend or accountability partner</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/50" /> Step outside for 5 minutes</li>
          </ul>
        </div>
      </div>

      {/* Custom Routines Section */}
      <SectionCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Custom Routines
            </h3>
            <p className="text-sm text-muted">Build personalized emergency plans for when urges hit.</p>
          </div>
          {!isPremium && routines.length >= 1 ? (
            <Link
              href="/dashboard/upgrade"
              className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-indigo-500/20 border border-primary/30 hover:border-primary/60 text-primary px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              <Crown className="w-4 h-4" /> Unlock More
            </Link>
          ) : (
            <PrimaryButton
              onClick={() => { setShowBuilder(true); setEditingRoutine(null); setRoutineName(''); setRoutineSteps([]) }}
              className="px-4 py-2.5 text-sm"
            >
              <Plus className="w-4 h-4" /> New Routine
            </PrimaryButton>
          )}
        </div>

        {!isPremium && routines.length >= 1 && (
          <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            Free tier includes 1 custom routine. Upgrade to Premium for unlimited routines.
          </div>
        )}

        {/* Saved Routines List */}
        {routines.length === 0 && !showBuilder ? (
          <div className="text-center py-10 text-muted">
            <Timer className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No routines yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-3 mb-6">
            {routines.map(routine => (
              <div key={routine.id} className="flex items-center justify-between bg-background border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div>
                  <p className="font-bold">{routine.name}</p>
                  <p className="text-xs text-muted">{routine.steps.length} steps • {routine.steps.reduce((t, s) => t + s.duration, 0)}s total</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startRoutine(routine)} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" /> Start
                  </button>
                  <button onClick={() => editRoutine(routine)} className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-hover transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteRoutine(routine.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Routine Builder Modal */}
        {showBuilder && (
          <div className="border-t border-border pt-6 mt-4">
            <h4 className="text-lg font-bold mb-4">{editingRoutine ? 'Edit Routine' : 'New Routine'}</h4>

            <input
              type="text"
              placeholder="Routine name (e.g. 'Night Time Reset')"
              value={routineName}
              onChange={e => setRoutineName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 mb-4 text-sm font-medium focus:outline-none focus:border-primary"
            />

            <p className="text-xs font-bold text-muted uppercase mb-2">Add steps:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { type: 'breathe', label: '🌬️ Breathe', color: 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20' },
                { type: 'hold', label: '⏸️ Hold', color: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20' },
                { type: 'action', label: '💪 Action', color: 'bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20' },
                { type: 'affirmation', label: '💭 Affirmation', color: 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20' },
                { type: 'timer', label: '⏱️ Timer', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' },
              ].map(s => (
                <button key={s.type} onClick={() => addStep(s.type as RoutineStep['type'])} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.color} transition-colors`}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              {routineSteps.map((step, i) => (
                <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl border ${getStepColor(step.type)}`}>
                  <GripVertical className="w-4 h-4 opacity-30 flex-shrink-0" />
                  <span className="text-sm font-bold w-5">{i + 1}.</span>
                  <span className="text-lg">{getStepIcon(step.type)}</span>
                  <input
                    type="text"
                    value={step.label}
                    onChange={e => updateStep(step.id, 'label', e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm font-medium focus:outline-none"
                  />
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="number"
                      value={step.duration}
                      onChange={e => updateStep(step.id, 'duration', parseInt(e.target.value) || 1)}
                      min={1}
                      max={300}
                      className="w-14 bg-background border border-border rounded-lg px-2 py-1 text-xs text-center font-mono focus:outline-none"
                    />
                    <span className="text-xs text-muted">s</span>
                  </div>
                  <button onClick={() => removeStep(step.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {routineSteps.length === 0 && (
                <p className="text-center text-muted text-sm py-4">Add steps above to build your routine</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveRoutine}
                disabled={!routineName.trim() || routineSteps.length === 0}
                className="bg-primary hover:bg-primary-hover disabled:opacity-40 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                {editingRoutine ? 'Save Changes' : 'Create Routine'}
              </button>
              <button
                onClick={() => { setShowBuilder(false); setEditingRoutine(null) }}
                className="bg-surface-hover hover:bg-border text-foreground px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
    )
  }
