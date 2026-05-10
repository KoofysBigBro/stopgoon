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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">New Entry</h1>
          <div className="flex items-center gap-4">
            {saveStatus === 'saved' && (
              <span className="text-sm font-medium text-emerald-500 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            <button
              onClick={() => { setIsWriting(false); setTitle(''); setContent(''); setSelectedMood(null) }}
              className="text-muted hover:text-foreground p-2 transition-colors rounded-full hover:bg-surface-hover"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Entry type selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {ENTRY_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setEntryType(t.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                entryType === t.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'border-border text-muted hover:border-primary/50 hover:text-foreground bg-surface'
              }`}
            >{t.label}</button>
          ))}
        </div>

        {/* Daily prompt */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8 flex gap-4 items-start">
          <div className="bg-primary/10 p-2 rounded-full shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">Reflection Prompt</p>
            <p className="text-base text-foreground font-medium">{prompt}</p>
          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this entry a title..."
          className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted/50 mb-6 text-foreground font-heading tracking-tight"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Start writing..."
          autoFocus
          className="w-full bg-transparent border-none outline-none text-lg leading-relaxed placeholder:text-muted/50 resize-none mb-8 text-foreground"
        />

        {/* Mood selector */}
        <div className="mb-10">
          <label className="text-sm font-semibold block mb-4 text-foreground">How are you feeling?</label>
          <div className="flex flex-wrap gap-2.5">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(selectedMood === m.value ? null : m.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                  selectedMood === m.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'border-border text-muted hover:border-primary/50 hover:text-foreground bg-surface'
                }`}
              >
                <span className="text-lg">{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!content.trim() || isSaving}
          className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          {isSaving ? 'Saving...' : 'Save Journal Entry'}
        </button>
      </div>
    )
  }

  // List mode
  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Journal</h1>
          <p className="text-muted text-lg">A safe space for reflection and honesty.</p>
        </div>
        <button
          onClick={() => setIsWriting(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] shadow-sm shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Write Entry
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your entries..."
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-surface hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
        />
      </div>

      {/* Entries list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-3xl p-16 text-center shadow-sm">
          <BookHeart className="w-12 h-12 text-muted/50 mx-auto mb-6" />
          <p className="text-muted text-lg mb-6 max-w-sm mx-auto leading-relaxed">
            {searchQuery ? "No entries match your search." : "Your journal is empty. Take a moment to reflect on your day."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsWriting(true)}
              className="text-primary font-semibold hover:underline text-lg"
            >
              Write your first entry
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-surface border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:border-primary/20"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-widest">
                    {entry.type}
                  </span>
                  {entry.mood && (
                    <span className="text-sm font-medium text-muted flex items-center gap-1.5">
                      <span className="text-lg">{MOODS.find(m => m.value === entry.mood)?.emoji || ''}</span>
                      {MOODS.find(m => m.value === entry.mood)?.label || entry.mood}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted">
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  {deleteConfirm === entry.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in bg-surface-hover px-2 py-1 rounded-md">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs text-red-500 font-bold hover:text-red-600 uppercase tracking-wide"
                      >Delete</button>
                      <span className="text-xs text-border">|</span>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-muted hover:text-foreground font-bold uppercase tracking-wide"
                      >Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(entry.id)}
                      className="text-muted/50 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {entry.title && (
                <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight font-heading">{entry.title}</h3>
              )}

              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-[15px]">
                {entry.content.length > 300 ? entry.content.slice(0, 300) + '...' : entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
