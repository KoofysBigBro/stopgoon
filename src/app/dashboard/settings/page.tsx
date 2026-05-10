'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  Palette, Accessibility, Database, CreditCard, User, LogOut,
  Check, Loader2, Download, Trash2, Moon, Sun, Type, Eye, ArrowRight, ShieldCheck, Pencil
} from 'lucide-react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userCreated, setUserCreated] = useState('')
  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [usernameChangedAt, setUsernameChangedAt] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  // Settings state
  const { theme, setTheme } = useTheme()
  const [fontScale, setFontScale] = useState('normal')
  const [motion, setMotion] = useState('normal')
  const [highContrast, setHighContrast] = useState(false)
  const [dailyReminder, setDailyReminder] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        setUserCreated(new Date(user.created_at).toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric'
        }))

        // Load username and premium status
        const { data: profile } = await supabase
          .from('users')
          .select('username, username_changed_at, subscription_tier')
          .eq('id', user.id)
          .single()
        if (profile) {
          setUsername(profile.username || user.email?.split('@')[0] || '')
          setNewUsername(profile.username || user.email?.split('@')[0] || '')
          setUsernameChangedAt(profile.username_changed_at)
          setIsPremium(profile.subscription_tier === 'premium')
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
    } catch {
      // settings might not exist yet
    }
    setIsLoading(false)
  }

  const getNextChangeDate = () => {
    if (!usernameChangedAt) return null
    const changed = new Date(usernameChangedAt)
    const cooldownDays = isPremium ? 3 : 3.5 // 3.5 days = twice weekly
    const nextChange = new Date(changed.getTime() + cooldownDays * 24 * 60 * 60 * 1000)
    return nextChange
  }

  const canChangeUsername = () => {
    if (!usernameChangedAt) return true
    const nextDate = getNextChangeDate()
    if (!nextDate) return true
    return new Date() >= nextDate
  }

  const handleUsernameChange = async () => {
    setUsernameError(null)
    const trimmed = newUsername.trim()
    if (!trimmed || trimmed.length < 2) {
      setUsernameError('Username must be at least 2 characters.')
      return
    }
    if (trimmed.length > 20) {
      setUsernameError('Username must be 20 characters or less.')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError('Only letters, numbers, and underscores.')
      return
    }
    if (!canChangeUsername()) {
      const nextDate = getNextChangeDate()
      setUsernameError(`You can change your username again on ${nextDate?.toLocaleDateString()}.`)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({ username: trimmed, username_changed_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      setUsernameError('Username may already be taken.')
      return
    }

    setUsername(trimmed)
    setUsernameChangedAt(new Date().toISOString())
    setEditingUsername(false)
    setSaveMessage('Username updated!')
    setTimeout(() => setSaveMessage(null), 2000)
  }

  // Sync loaded theme with next-themes if available
  useEffect(() => {
    // If the DB has a specific theme preference, we could sync it here
  }, [])

  // Apply text size to DOM whenever it changes
  useEffect(() => {
    const sizes: Record<string, string> = { normal: '16px', large: '18px', xlarge: '20px' }
    document.documentElement.style.fontSize = sizes[fontScale] || '16px'
  }, [fontScale])

  // Apply reduced motion to DOM
  useEffect(() => {
    if (motion === 'reduced') {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  }, [motion])

  // Apply high contrast to DOM
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  const saveSetting = async (field: string, value: string | boolean) => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('settings')
        .upsert({ user_id: user.id, [field]: value, updated_at: new Date().toISOString() })

      setSaveMessage('Saved')
      setTimeout(() => setSaveMessage(null), 2000)
    } catch {
      setSaveMessage('Could not save')
      setTimeout(() => setSaveMessage(null), 3000)
    }
    setIsSaving(false)
  }

  const handleExportData = async () => {
    try {
      const { data: journal } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false })
      const { data: urges } = await supabase.from('urge_logs').select('*').order('created_at', { ascending: false })
      const { data: checkins } = await supabase.from('daily_checkins').select('*').order('created_at', { ascending: false })
      const { data: relapses } = await supabase.from('relapses').select('*').order('created_at', { ascending: false })

      const exportData = {
        exported_at: new Date().toISOString(),
        journal_entries: journal || [],
        urge_logs: urges || [],
        daily_checkins: checkins || [],
        relapses: relapses || [],
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stopgoon-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      setSaveMessage('Data exported')
      setTimeout(() => setSaveMessage(null), 2000)
    } catch {
      setSaveMessage('Export failed')
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    // In production, this would call a server-side function
    // For now, sign out and show message
    await supabase.auth.signOut()
    router.push('/')
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
            saveMessage === 'Saved' || saveMessage === 'Data exported'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}>
            {saveMessage === 'Saved' || saveMessage === 'Data exported' ? <Check className="w-4 h-4" /> : null}
            {saveMessage}
          </span>
        )}
      </header>

      <div className="space-y-6">

        {/* Account */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Account</h2>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Username</p>
                {editingUsername ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      maxLength={20}
                      className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-indigo-500 w-48"
                    />
                    <button onClick={handleUsernameChange} className="text-sm font-bold text-indigo-600 hover:underline">Save</button>
                    <button onClick={() => { setEditingUsername(false); setNewUsername(username); setUsernameError(null) }} className="text-sm text-slate-500 hover:underline">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{username}</p>
                    <button
                      onClick={() => setEditingUsername(true)}
                      disabled={!canChangeUsername()}
                      className="text-indigo-500 hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={canChangeUsername() ? 'Edit username' : `Available again ${getNextChangeDate()?.toLocaleDateString()}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                {!canChangeUsername() && !editingUsername && (
                  <p className="text-xs text-muted mt-0.5">Next change: {getNextChangeDate()?.toLocaleDateString()}{isPremium ? ' (Premium: every 3 days)' : ' (Free: twice weekly)'}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</p>
                <p className="font-medium">{userEmail}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Member since</p>
                <p className="font-medium">{userCreated}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            {showLogoutConfirm ? (
              <div className="flex items-center gap-3 animate-in fade-in">
                <p className="text-sm text-slate-600 dark:text-slate-400">Are you sure?</p>
                <button onClick={handleSignOut} className="text-sm font-semibold text-red-600 hover:underline">
                  Yes, sign out
                </button>
                <button onClick={() => setShowLogoutConfirm(false)} className="text-sm text-slate-500 hover:underline">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            )}
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Appearance</h2>
          </div>

          <div className="space-y-6">
            {/* Theme */}
            <div>
              <label className="text-sm font-semibold block mb-3">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setTheme('light'); saveSetting('theme', 'light') }}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">Light</p>
                    <p className="text-xs text-muted">Calm &amp; warm</p>
                  </div>
                </button>
                <button
                  onClick={() => { setTheme('dark'); saveSetting('theme', 'dark') }}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">Dark</p>
                    <p className="text-xs text-muted">Immersive focus</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Text Size */}
            <div>
              <label className="text-sm font-semibold block mb-3">
                <Type className="w-4 h-4 inline mr-1.5" />
                Text Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'normal', label: 'Normal', size: 'text-sm' },
                  { value: 'large', label: 'Large', size: 'text-base' },
                  { value: 'xlarge', label: 'Extra Large', size: 'text-lg' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setFontScale(opt.value); saveSetting('font_scale', opt.value) }}
                    className={`py-3 rounded-xl border-2 font-medium transition-all ${opt.size} ${
                      fontScale === opt.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Accessibility className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Accessibility</h2>
          </div>

          <div className="space-y-4">
            {/* Reduced motion */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Reduced Motion</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Minimize animations throughout the app</p>
              </div>
              <button
                onClick={() => {
                  const newVal = motion === 'reduced' ? 'normal' : 'reduced'
                  setMotion(newVal)
                  saveSetting('motion', newVal)
                }}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  motion === 'reduced' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                  motion === 'reduced' ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {/* High contrast */}
            <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  High Contrast
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Increase text contrast for readability</p>
              </div>
              <button
                onClick={() => {
                  const newVal = !highContrast
                  setHighContrast(newVal)
                  saveSetting('high_contrast', newVal)
                }}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  highContrast ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                  highContrast ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Subscription</h2>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-bold text-indigo-900 dark:text-indigo-100">Free Plan</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">All core recovery tools included.</p>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-700">
                Active
              </span>
            </div>
            <Link 
              href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Upgrade to Premium
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Data &amp; Privacy</h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Your data is encrypted and stored securely. You can export or delete it at any time.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All Data
            </button>

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
        </section>

        {/* Legal */}
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
