'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  Database, CreditCard, Check, Loader2, Trash2, ArrowRight, ShieldCheck, Bell, Crown, X
} from 'lucide-react'
import DataExport from './DataExport'
import DeviceSettings from './DeviceSettings'
import AccountSection from './components/AccountSection'
import AppearanceSection from './components/AppearanceSection'
import AccessibilitySection from './components/AccessibilitySection'
import Toggle from './components/Toggle'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userCreated, setUserCreated] = useState('')
  const [username, setUsername] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(true)

  const searchParams = useSearchParams()
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(searchParams.get('upgrade') === 'success')

  const { setTheme } = useTheme()
  const [fontScale, setFontScale] = useState('normal')
  const [motion, setMotion] = useState('normal')
  const [highContrast, setHighContrast] = useState(false)
  const [dailyReminder, setDailyReminder] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const loadSettings = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        setUserCreated(new Date(user.created_at).toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric'
        }))

        const { data: profile } = await supabase
          .from('users')
          .select('username, subscription_tier, avatar_url, is_public')
          .eq('id', user.id)
          .single()
        if (profile) {
          setUsername(profile.username || user.email?.split('@')[0] || '')
          setIsPremium(profile.subscription_tier === 'premium')
          setAvatarUrl(profile.avatar_url || null)
          setIsPublic(profile.is_public !== false)
        }
      }

      const { data } = await supabase.from('settings').select('*').single()
      if (data) {
        const mappedTheme = data.theme === 'midnight' ? 'dark' : data.theme === 'calm' ? 'light' : (data.theme || 'dark')
        setTheme(mappedTheme)
        setFontScale(data.font_scale || 'normal')
        setMotion(data.motion || 'normal')
        setHighContrast(data.high_contrast || false)
        setDailyReminder(data.daily_reminder || false)
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to load settings:', e)
    }
    setIsLoading(false)
  }, [setTheme, supabase])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  useEffect(() => {
    document.documentElement.setAttribute('data-font-scale', fontScale)
  }, [fontScale])

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motion)
  }, [motion])

  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', String(highContrast))
  }, [highContrast])

  const saveSetting = async (field: string, value: string | boolean) => {
    setSaveMessage(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('settings')
        .upsert({ user_id: user.id, [field]: value, updated_at: new Date().toISOString() })

      setSaveMessage('Saved')
      setTimeout(() => setSaveMessage(null), 2000)
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to save setting:', e)
      setSaveMessage('Could not save')
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await supabase.rpc('delete_user_account')
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error(error)
      setSaveMessage('Failed to delete account.')
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-3xl">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Customize your experience.</p>
        </div>
        {saveMessage && (
          <span className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-in fade-in ${
            saveMessage === 'Could not save' || saveMessage === 'Upload failed' || saveMessage === 'Image must be under 2MB'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
          }`}>
            {saveMessage !== 'Could not save' && saveMessage !== 'Upload failed' && saveMessage !== 'Image must be under 2MB' && <Check className="w-4 h-4" />}
            {saveMessage}
          </span>
        )}
      </header>

      {showUpgradeSuccess && (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-primary/10 p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-primary/5 animate-gradient-shift" style={{backgroundSize: '200% 200%'}} />
          <button onClick={() => setShowUpgradeSuccess(false)} className="absolute top-3 right-3 text-muted hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-1">Welcome to Premium!</h3>
              <p className="text-sm text-muted leading-relaxed">
                You now have full access to AI coaching, predictive warnings, custom SOS routines, advanced analytics, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <AccountSection
          username={username}
          userEmail={userEmail}
          userCreated={userCreated}
          avatarUrl={avatarUrl}
          isPublic={isPublic}
          isPremium={isPremium}
          onSaveMessage={(msg) => {
            setSaveMessage(msg)
            if (msg) setTimeout(() => setSaveMessage(null), 2000)
          }}
        />

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Retention Nudges</h2>
          </div>

          <Toggle
            enabled={dailyReminder}
            onChange={(v) => {
              setDailyReminder(v)
              saveSetting('daily_reminder', v)
            }}
            label="Daily Recovery Reminder"
            description="Gentle check-in reminder with supportive language"
          />

          <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Nudge examples</p>
            <p className="text-sm text-foreground">&quot;Two minutes now protects your focus later. Want to check in?&quot;</p>
          </div>
        </section>

        <AppearanceSection
          fontScale={fontScale}
          setFontScale={setFontScale}
          saveSetting={saveSetting}
        />

        <AccessibilitySection
          motion={motion}
          setMotion={setMotion}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          saveSetting={saveSetting}
        />

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Subscription</h2>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-bold text-indigo-900 dark:text-indigo-100">
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                {isPremium ? 'All premium features unlocked.' : 'All core recovery tools included.'}
              </p>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-700">
                Active
              </span>
            </div>
            {!isPremium && (
              <Link
                href="/dashboard/upgrade"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Upgrade to Premium
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>

        <DeviceSettings />

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Data &amp; Privacy</h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Your data is encrypted and stored securely. You can delete it at any time.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-3 animate-in fade-in">
                <p className="text-sm text-red-600 font-medium">This cannot be undone.</p>
                <button
                  onClick={handleDeleteAccount}
                  className="text-sm font-bold text-red-600 hover:underline"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-sm text-slate-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-lg font-medium transition-colors border border-red-200 dark:border-red-800/50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            )}
          </div>

          <DataExport isPremium={isPremium} />
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Legal Information</h2>
          </div>

          <div className="flex flex-col space-y-3">
            <Link href="/terms" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/refund" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Refund Policy
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
