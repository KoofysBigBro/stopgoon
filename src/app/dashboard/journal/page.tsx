'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { BookHeart, Search, Loader2, Check, Trash2, Plus, X, Lightbulb } from 'lucide-react'

const MOODS = [
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'hopeful', emoji: '🌱', label: 'Hopeful' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
  { value: 'proud', emoji: '💪', label: 'Proud' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
]

const ENTRY_TYPES = [
  { value: 'reflection', label: 'Reflection', description: 'Write freely about your day' },
  { value: 'gratitude', label: 'Gratitude', description: 'Name things you appreciate' },
  { value: 'relapse', label: 'Relapse Reflection', description: 'Understand what happened without judgement' },
]

const DAILY_PROMPTS = [
  'What was the hardest moment today, and how did you handle it?',
  'Name three things you are grateful for right now.',
  'What triggered your last urge? What helped it pass?',
  'Describe one small win from today.',
  'What would you tell a friend going through the same thing?',
  'How has your thinking changed since you started this journey?',
  'What activity brought you the most peace today?',
  'Write a letter to your future self about why you are doing this.',
]

type JournalEntry = {
  id: string
  title: string | null
  type: string
  content: string
  mood: string | null
  tags: string[]
  created_at: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isWriting, setIsWriting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // New entry form
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [entryType, setEntryType] = useState('reflection')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadEntries()
    setPrompt(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)])
  }, [])

  const loadEntries = async () => {
    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setEntries(data)
    } catch {
      // table might not exist
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const { error } = await supabase.from('journal_entries').insert({
        title: title.trim() || null,
        type: entryType,
        content: content.trim(),
        mood: selectedMood,
        tags: [],
      })

      if (error) throw error

      setSaveStatus('saved')
      setTimeout(() => {
        setIsWriting(false)
        setTitle('')
        setContent('')
        setEntryType('reflection')
        setSelectedMood(null)
        setSaveStatus('idle')
        loadEntries()
      }, 1000)
    } catch {
      setSaveStatus('idle')
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('journal_entries').delete().eq('id', id)
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch {
      // graceful
    }
    setDeleteConfirm(null)
  }

  const filteredEntries = entries.filter(e => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      e.content.toLowerCase().includes(q) ||
      (e.title && e.title.toLowerCase().includes(q)) ||
      e.type.toLowerCase().includes(q)
    )
  })

  // Writing mode
  if (isWriting) {
    return (
      <div className="animate-in fade-in duration-300 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">New Entry</h1>
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            <button
              onClick={() => { setIsWriting(false); setTitle(''); setContent(''); setSelectedMood(null) }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Entry type selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {ENTRY_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setEntryType(t.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                entryType === t.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >{t.label}</button>
          ))}
        </div>

        {/* Daily prompt */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <Lightbulb className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-0.5">Today&apos;s prompt</p>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">{prompt}</p>
          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 mb-4"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Start writing..."
          autoFocus
          className="w-full bg-transparent border-none outline-none text-lg leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none mb-6"
        />

        {/* Mood selector */}
        <div className="mb-6">
          <label className="text-sm font-semibold block mb-3">How are you feeling?</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(selectedMood === m.value ? null : m.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-1.5 ${
                  selectedMood === m.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <span>{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!content.trim() || isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    )
  }

  // List mode
  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Journal</h1>
          <p className="text-slate-500 dark:text-slate-400">Reflect on your journey. Honesty is growth.</p>
        </div>
        <button
          onClick={() => setIsWriting(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your entries..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Entries list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
          <BookHeart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {searchQuery ? 'No entries match your search.' : 'No entries yet. Start writing to track your journey.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsWriting(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Write your first entry
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {entry.type}
                  </span>
                  {entry.mood && (
                    <span className="text-sm">
                      {MOODS.find(m => m.value === entry.mood)?.emoji || ''}{' '}
                      {MOODS.find(m => m.value === entry.mood)?.label || entry.mood}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  {deleteConfirm === entry.id ? (
                    <div className="flex items-center gap-1 animate-in fade-in">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >Delete</button>
                      <span className="text-xs text-slate-400">|</span>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-slate-500 hover:underline"
                      >Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(entry.id)}
                      className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {entry.title && (
                <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
              )}

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.content.length > 300 ? entry.content.slice(0, 300) + '...' : entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
