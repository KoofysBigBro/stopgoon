'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Camera, Globe, Lock, Pencil, LogOut, Loader2 } from 'lucide-react'

type AccountSectionProps = {
  username: string
  userEmail: string
  userCreated: string
  avatarUrl: string | null
  isPublic: boolean
  isPremium: boolean
  onSaveMessage: (msg: string | null) => void
}

export default function AccountSection({
  username: initialUsername,
  userEmail,
  userCreated,
  avatarUrl: initialAvatarUrl,
  isPublic: initialIsPublic,
  isPremium,
  onSaveMessage,
}: AccountSectionProps) {
  const [username, setUsername] = useState(initialUsername)
  const [newUsername, setNewUsername] = useState(initialUsername)
  const [usernameChangedAt, setUsernameChangedAt] = useState<string | null>(null)
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const getNextChangeDate = () => {
    if (!usernameChangedAt) return null
    const changed = new Date(usernameChangedAt)
    const cooldownDays = isPremium ? 3 : 3.5
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
    onSaveMessage('Username updated!')
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      onSaveMessage('Image must be under 2MB')
      return
    }

    setUploadingAvatar(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      onSaveMessage('Upload failed')
      setUploadingAvatar(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
    setAvatarUrl(publicUrl)
    setUploadingAvatar(false)
    onSaveMessage('Avatar updated!')
  }

  const handleTogglePublic = async () => {
    const newVal = !isPublic
    setIsPublic(newVal)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('users').update({ is_public: newVal }).eq('id', user.id)
    onSaveMessage(newVal ? 'Profile is now public' : 'Profile is now private')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-bold">Account</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-border overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" unoptimized />
              ) : (
                <User className="w-8 h-8 text-muted" />
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" aria-label="Upload avatar image">
              {uploadingAvatar ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <p className="font-bold">{username}</p>
            <p className="text-xs text-muted">Hover the photo to change</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="font-medium flex items-center gap-2">
              {isPublic ? <Globe className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
              Profile Visibility
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isPublic ? 'Anyone can view your stats and progress' : 'Only you can see your stats'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            aria-label="Profile visibility"
            onClick={handleTogglePublic}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              isPublic ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
              isPublic ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>

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
                  aria-label="New username"
                />
                <button onClick={handleUsernameChange} className="text-sm font-bold text-indigo-600 hover:underline">Save</button>
                <button onClick={() => { setEditingUsername(false); setNewUsername(username); setUsernameError(null) }} className="text-sm text-slate-500 hover:underline">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-bold">{username}</p>
                <button
                  type="button"
                  onClick={() => setEditingUsername(true)}
                  disabled={!canChangeUsername()}
                  className="text-indigo-500 hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={canChangeUsername() ? 'Edit username' : `Available again ${getNextChangeDate()?.toLocaleDateString()}`}
                  aria-label="Edit username"
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
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        )}
      </div>
    </section>
  )
}
