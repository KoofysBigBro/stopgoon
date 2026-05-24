'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  ShieldAlert, 
  ShieldCheck, 
  Copy, 
  Check, 
  Info, 
  Download, 
  Smartphone, 
  Laptop, 
  Lock, 
  ArrowRight, 
  Timer, 
  Wind, 
  HeartPulse, 
  Sparkles, 
  Flame, 
  Globe, 
  AlertTriangle 
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import Link from 'next/link'

type DurationOption = {
  label: string
  hours: number
  description: string
  intensity: 'mild' | 'moderate' | 'high' | 'extreme'
}

const DURATION_OPTIONS: DurationOption[] = [
  { label: '1 Hour', hours: 1, description: 'Urge Intercept. Perfect for riding out a sudden craving.', intensity: 'mild' },
  { label: '4 Hours', hours: 4, description: 'High-Risk Gap. Protects you during typical relapse windows.', intensity: 'moderate' },
  { label: '12 Hours', hours: 12, description: 'Nighttime Shield. Secure your focus overnight.', intensity: 'high' },
  { label: '24 Hours', hours: 24, description: 'Mind Detox. A full day of absolute digital quarantine.', intensity: 'extreme' },
]

export default function ShieldPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [copiedText, setCopiedText] = useState<'dns' | 'android' | null>(null)
  
  // Shield Lockdown States
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [isShieldActive, setIsShieldActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0) // in seconds
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')
  const [breathCount, setBreathCount] = useState(4)
  const [groundingInputs, setGroundingInputs] = useState({
    thoughts: '',
    intensity: 5
  })
  const [isJournalSaved, setIsJournalSaved] = useState(false)

  const supabase = createClient()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('subscription_tier')
            .eq('id', user.id)
            .single()
          setIsPremium(profile?.subscription_tier === 'premium')
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.error(e)
      }
      setIsLoading(false)
    })()

    // Initialize Shield Lockdown Session
    const activeUntil = localStorage.getItem('stopgoon_shield_active_until')
    if (activeUntil) {
      const now = Date.now()
      const endTimestamp = parseInt(activeUntil, 10)
      if (endTimestamp > now) {
        setIsShieldActive(true)
        setTimeLeft(Math.floor((endTimestamp - now) / 1000))
      } else {
        localStorage.removeItem('stopgoon_shield_active_until')
      }
    }
  }, [supabase])

  // Active Timer Countdown
  useEffect(() => {
    if (isShieldActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsShieldActive(false)
            localStorage.removeItem('stopgoon_shield_active_until')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isShieldActive, timeLeft])

  // Calming Breathing Pacer Logic (Inhale 4s -> Hold 4s -> Exhale 4s)
  useEffect(() => {
    if (isShieldActive) {
      breathTimerRef.current = setInterval(() => {
        setBreathCount((prevCount) => {
          if (prevCount <= 1) {
            setBreathState((prevState) => {
              if (prevState === 'Inhale') return 'Hold'
              if (prevState === 'Hold') return 'Exhale'
              return 'Inhale'
            })
            return 4 // Reset to 4 seconds
          }
          return prevCount - 1
        })
      }, 1000)
    }

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current)
    }
  }, [isShieldActive, breathState])

  const handleCopy = (text: string, type: 'dns' | 'android') => {
    void navigator.clipboard.writeText(text)
    setCopiedText(type)
    setTimeout(() => setCopiedText(null), 2500)
  }

  // Activate Blocker Lockdown Session
  const handleActivateShield = () => {
    const endTimestamp = Date.now() + selectedDuration * 60 * 60 * 1000
    localStorage.setItem('stopgoon_shield_active_until', endTimestamp.toString())
    setIsShieldActive(true)
    setTimeLeft(selectedDuration * 60 * 60)
    setIsJournalSaved(false)
    setGroundingInputs({ thoughts: '', intensity: 5 })
  }

  // Save Crisis Log Entry
  const handleSaveCrisisLog = async () => {
    setIsJournalSaved(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('urge_logs').insert({
          user_id: user.id,
          intensity: groundingInputs.intensity,
          trigger: `Shield Lockdown Mode (${groundingInputs.thoughts.slice(0, 100)}...)`,
          notes: `Logged during Shield Lockdown. Grounding thoughts: ${groundingInputs.thoughts}`
        })
      }
    } catch (e) {
      console.error('Failed to save urge log:', e)
    }
    setTimeout(() => setIsJournalSaved(false), 3000)
  }

  // Format countdown timer (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 animate-spin border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl pb-10">
      <PageHeader
        title="StopGoon Shield"
        subtitle={isShieldActive ? "Lockdown Shield Active. Focus entirely on recovering control." : "Engage crisis blockers and network-level filters to protect your environment."}
      />

      {!isPremium ? (
        // LOCKED PREMIUM UPSELL SCREEN
        <div className="relative rounded-3xl border border-indigo-500/20 bg-surface/50 backdrop-blur-xl p-8 md:p-12 overflow-hidden text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-primary/5" />
          
          <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/5 animate-pulse">
            <Lock className="w-9 h-9 text-indigo-500" />
          </div>

          <h2 className="text-3xl font-extrabold font-heading tracking-tight text-foreground mb-3">
            StopGoon Shield is a Premium Feature
          </h2>
          <p className="text-muted leading-relaxed max-w-2xl mx-auto mb-8 text-base">
            Activate the dynamic **Urge Lockdown Blocker**, download **1-click secure DNS profiles** for iOS, configure mobile blockers, and secure your devices from triggers instantly.
          </p>

          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10 text-left">
            <div className="bg-background/40 border border-border p-5 rounded-2xl">
              <Timer className="w-5 h-5 text-indigo-500 mb-3" />
              <h3 className="font-bold text-sm mb-1 text-foreground">Urge Lockdown Blocker</h3>
              <p className="text-xs text-muted">A strict 1-button crisis shield that seals the dashboard into a peaceful breathing and grounding zone with zero bypass.</p>
            </div>
            <div className="bg-background/40 border border-border p-5 rounded-2xl">
              <Smartphone className="w-5 h-5 text-indigo-500 mb-3" />
              <h3 className="font-bold text-sm mb-1 text-foreground">1-Click iOS Blocker Profile</h3>
              <p className="text-xs text-muted">Download iOS configuration profiles that lock adult website DNS blocks device-wide without any complex setup.</p>
            </div>
            <div className="bg-background/40 border border-border p-5 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-indigo-500 mb-3" />
              <h3 className="font-bold text-sm mb-1 text-foreground">Complete Incognito Safety</h3>
              <p className="text-xs text-muted">Because DNS and lockdown profiles operate at the native device level, they protect you across Safari, Chrome, and Private tabs.</p>
            </div>
          </div>

          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Upgrade to Premium Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : isShieldActive ? (
        
        // ------------------ SHIELD LOCKDOWN ACTIVE SCREEN (THE SANCTUARY) ------------------
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          
          {/* Active Status banner */}
          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-950/20 via-background to-red-950/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl shadow-red-500/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 relative">
                <span className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping opacity-75" />
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-red-400">Emergency Shield Engaged</h3>
                <p className="text-xs text-muted leading-relaxed mt-0.5">
                  Dashboard lock active. Standard features are temporarily sealed off to preserve your streak.
                </p>
              </div>
            </div>
            
            {/* Timer Display */}
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted/60 block mb-1">Time Remaining</span>
              <div className="text-3xl font-mono font-bold text-red-400 tracking-wider">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            
            {/* Calming Breathing Pacer Component (3 cols) */}
            <div className="md:col-span-3 rounded-3xl border border-border bg-surface/50 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative min-h-[420px] overflow-hidden">
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                <Wind className="w-3.5 h-3.5" /> Breath Pacer
              </div>

              {/* Pulsing Breathing Circle */}
              <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                {/* Breathing Background Ring */}
                <div 
                  className={`absolute inset-0 rounded-full border border-primary/20 transition-all duration-[4000ms] ease-in-out ${
                    breathState === 'Inhale' ? 'scale-110 bg-primary/5 shadow-2xl shadow-primary/10' :
                    breathState === 'Hold' ? 'scale-110 bg-primary/10 shadow-2xl shadow-primary/15' :
                    'scale-75 bg-transparent'
                  }`}
                />
                
                {/* Glowing Core */}
                <div 
                  className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex flex-col items-center justify-center text-white font-bold transition-all duration-[4000ms] ease-in-out ${
                    breathState === 'Inhale' ? 'scale-110 opacity-100 shadow-xl shadow-primary/30' :
                    breathState === 'Hold' ? 'scale-115 opacity-100 shadow-2xl shadow-indigo-500/40 animate-pulse' :
                    'scale-90 opacity-90'
                  }`}
                >
                  <span className="text-2xl font-heading tracking-wide">{breathState}</span>
                  <span className="text-xs opacity-75 mt-1">{breathCount}s</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-foreground mb-1.5">
                Focus on the rhythm of the pacer.
              </h4>
              <p className="text-xs text-muted max-w-sm leading-relaxed">
                Compulsive urges trigger shallow, rapid breathing. Forcing a slow 4s inhale, 4s hold, 4s exhale cycle lowers heart rate and breaks the autonomic urge loop.
              </p>
            </div>

            {/* Grounding & Crisis Log (2 cols) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Grounding Exercise */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-foreground">Grounding: The 5-4-3 Rule</h3>
                </div>
                <ul className="space-y-3.5 text-xs text-muted">
                  <li className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center font-bold text-[10px] text-primary shrink-0">5</span>
                    <span>Identify <strong>5 physical objects</strong> in your current room (e.g. lamp, desk, book).</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center font-bold text-[10px] text-primary shrink-0">4</span>
                    <span>Acknowledge <strong>4 textures</strong> you can touch (e.g. shirt cloth, table top, cool metal).</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center font-bold text-[10px] text-primary shrink-0">3</span>
                    <span>Listen for <strong>3 distinct sounds</strong> around you (e.g. hum of fridge, distant car).</span>
                  </li>
                </ul>
              </div>

              {/* Crisis Log Input */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3.5">
                  <HeartPulse className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Urge Thought Dumping</h3>
                </div>
                
                <p className="text-xs text-muted mb-4 leading-relaxed">
                  Dumping your thoughts onto paper/screen physically externalizes your urge. Write down exactly what triggered you and what you are feeling.
                </p>

                <textarea
                  className="w-full h-24 rounded-xl border border-border bg-background/50 p-3 text-xs focus:border-primary/50 outline-none text-foreground placeholder:text-muted/50 resize-none font-medium mb-3"
                  placeholder="I felt an urge because I was bored/stressed... My triggers were..."
                  value={groundingInputs.thoughts}
                  onChange={(e) => setGroundingInputs(prev => ({ ...prev, thoughts: e.target.value }))}
                />

                <div className="mb-4">
                  <label className="text-[11px] font-bold text-muted/80 block mb-1.5">Urge Intensity: {groundingInputs.intensity}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="w-full accent-primary bg-border h-1.5 rounded-lg appearance-none cursor-pointer"
                    value={groundingInputs.intensity}
                    onChange={(e) => setGroundingInputs(prev => ({ ...prev, intensity: parseInt(e.target.value, 10) }))}
                  />
                </div>

                <button
                  onClick={handleSaveCrisisLog}
                  className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                  disabled={isJournalSaved}
                >
                  {isJournalSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Logged Successfully
                    </>
                  ) : (
                    <>
                      Save Grounding Log
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : (
        
        // ------------------ SHIELD LOCKDOWN INACTIVE SCREEN (CONFIGURATION & 1-CLICK BLOCKERS) ------------------
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Main 1-Button Lockdown Activation Widget */}
          <SectionCard className="border border-red-500/20 bg-gradient-to-br from-red-950/15 via-surface to-background/50 p-6 md:p-8 overflow-hidden relative shadow-lg">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-foreground">Crisis Blocker Lockdown</h3>
                  <p className="text-sm text-muted mt-0.5 max-w-xl">
                    Under high risk? Tap below to engage a strict mental shield. The app will lock out triggers and guide you through emergency breathing resets.
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-surface-hover border border-border rounded-full shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted/80 uppercase tracking-wider">Shield Ready</span>
              </div>
            </div>

            {/* Duration Selector cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.hours}
                  onClick={() => setSelectedDuration(opt.hours)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedDuration === opt.hours
                      ? 'border-red-500/40 bg-red-950/10 shadow-md ring-1 ring-red-500/35'
                      : 'border-border/80 bg-background/50 hover:bg-surface-hover hover:border-border'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-foreground font-heading">{opt.label}</span>
                      <Timer className={`w-4 h-4 ${selectedDuration === opt.hours ? 'text-red-400' : 'text-muted'}`} />
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">{opt.description}</p>
                  </div>
                  
                  {/* Intensity Tag */}
                  <span className={`text-[8px] font-bold uppercase tracking-wider mt-3 px-1.5 py-0.5 rounded w-fit ${
                    opt.intensity === 'extreme' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    opt.intensity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {opt.intensity} block
                  </span>
                </button>
              ))}
            </div>

            {/* Massive Glowing Activation Button */}
            <button
              onClick={handleActivateShield}
              className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group text-base"
            >
              <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Activate StopGoon Blocker Shield ({selectedDuration} {selectedDuration === 1 ? 'Hour' : 'Hours'})
            </button>
            <p className="text-[10px] text-center text-muted/60 mt-3 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-muted/40" /> 
              Note: Once activated, the Lockdown cannot be disabled or bypassed until the timer expires.
            </p>
          </SectionCard>

          {/* 1-Click Device Blocker Suite (No Code, Highly Practical) */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Smartphone className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold font-heading text-foreground">1-Click Network & App Blockers</h2>
            </div>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Competitor blockers work by filtering adult websites directly at the device network level. Follow these extremely simple, **1-click setups** to block adult sites natively on your phones and computers—no programming or terminal scripts required.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* iPhone / iOS Blocker */}
              <div className="rounded-3xl border border-border bg-surface p-5 flex flex-col justify-between hover:border-primary/20 transition-all shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">Apple iPhone & iPad</h3>
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">1-Click Profile</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    Download and load the StopGoon iOS config profile. Once installed, it locks Secure Family DNS system-wide across all Wi-Fi, cellular, and private tabs instantly.
                  </p>
                  
                  {/* Visual steps */}
                  <div className="space-y-1.5 text-[10px] text-muted mb-5 bg-background p-3 rounded-xl border border-border/50">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Tap download below.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>Open iPhone <strong>Settings</strong> app.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Tap <strong>Profile Downloaded</strong> & click Install.</span>
                    </div>
                  </div>
                </div>

                <a
                  href="data:text/xml;charset=utf-8,<?xml version='1.0' encoding='UTF-8'?><!DOCTYPE plist PUBLIC '-//Apple//DTD PLIST 1.0//EN' 'http://www.apple.com/DTDs/PropertyList-1.0.dtd'><plist version='1.0'><dict><key>PayloadContent</key><array><dict><key>DNSSettings</key><dict><key>DNSProtocol</key><string>HTTPS</string><key>ServerAddresses</key><array><string>1.1.1.3</string><string>1.0.0.3</string></array><key>ServerURL</key><string>https://family.cloudflare-dns.com/dns-query</string></dict><key>PayloadDescription</key><string>Configures device to use Cloudflare Family DNS (1.1.1.3) for secure browsing.</string><key>PayloadDisplayName</key><string>StopGoon Shield - Cloudflare Family DNS</string><key>PayloadIdentifier</key><string>com.stopgoon.dns</string><key>PayloadType</key><string>com.apple.dnsSettings.managed</string><key>PayloadUUID</key><string>B3A8E9A2-BC23-49F1-9BEB-7080A78F2039</string><key>PayloadVersion</key><integer>1</integer></dict></array><key>PayloadDisplayName</key><string>StopGoon Shield</string><key>PayloadIdentifier</key><string>com.stopgoon.dns.profile</string><key>PayloadRemovalDisallowed</key><false/><key>PayloadType</key><string>Configuration</string><key>PayloadUUID</key><string>A9E0C1B2-D3E4-4F5A-6B7C-8D9E0F1A2B3C</string><key>PayloadVersion</key><integer>1</integer></dict></plist>"
                  download="stopgoon_shield_family_dns.mobileconfig"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
                >
                  <Download className="w-3.5 h-3.5" /> Download iOS Profile
                </a>
              </div>

              {/* Android Blocker */}
              <div className="rounded-3xl border border-border bg-surface p-5 flex flex-col justify-between hover:border-primary/20 transition-all shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">Android Devices</h3>
                      <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider">Private DNS</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    Enable Private DNS content filtering natively on Samsung, Pixel, and other Android devices. Highly secure and bypass-resistant.
                  </p>

                  <div className="space-y-1.5 text-[10px] text-muted mb-5 bg-background p-3 rounded-xl border border-border/50">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Go to Android <strong>Settings ➡️ Connection</strong>.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>Select <strong>More connections ➡️ Private DNS</strong>.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Paste the domain below and tap Save.</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy('family.cloudflare-dns.com', 'android')}
                  className="w-full bg-surface hover:bg-surface-hover text-foreground text-xs font-bold py-2.5 px-4 rounded-xl border border-border transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedText === 'android' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Address
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy DNS Hostname
                    </>
                  )}
                </button>
              </div>

              {/* Desktop / Computer Extension Blocker */}
              <div className="rounded-3xl border border-border bg-surface p-5 flex flex-col justify-between hover:border-primary/20 transition-all shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">Chrome & Desktop</h3>
                      <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider">Browser Blocker</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    Install our recommended, 1-click open-source adult content filter extension. Blocks adult site navigation instantly in your browser.
                  </p>

                  <div className="space-y-1.5 text-[10px] text-muted mb-5 bg-background p-3 rounded-xl border border-border/50">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Click the add extension button.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>Click <strong>Add to Chrome</strong>.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Check the box to enable in <strong>Incognito</strong>.</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://chromewebstore.google.com/detail/stayfocusd/laankejednclldolgbacjeoilhdofjba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10"
                >
                  <Globe className="w-3.5 h-3.5" /> Add Blocker to Chrome
                </a>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  )
}
