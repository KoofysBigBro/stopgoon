'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

type QuickAction = {
  label: string
  description: string
  href: string
}

const ACTIONS: QuickAction[] = [
  { label: 'Open SOS Mode', description: 'Emergency recovery tools', href: '/dashboard/sos' },
  { label: 'Log Urge', description: 'Track current urge intensity', href: '/dashboard' },
  { label: 'Write Journal', description: 'Add a quick reflection', href: '/dashboard/journal' },
  { label: 'Open Analytics', description: 'Review patterns and trends', href: '/dashboard/analytics' },
  { label: 'Weekly Review', description: 'See this week summary', href: '/dashboard/review' },
  { label: 'Accountability', description: 'Ping and manage partners', href: '/dashboard/accountability' },
  { label: 'Upgrade', description: 'Unlock premium insights', href: '/dashboard/upgrade' },
]

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isPaletteShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
      if (isPaletteShortcut) {
        event.preventDefault()
        setOpen(prev => !prev)
      }
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return ACTIONS
    return ACTIONS.filter(action => {
      return action.label.toLowerCase().includes(needle) || action.description.toLowerCase().includes(needle)
    })
  }, [query])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:right-6 z-40 hidden md:inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm font-semibold text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
      >
        <Search className="w-4 h-4" />
        Quick Actions
        <span className="text-xs text-muted">Ctrl+K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm p-4 md:p-10"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Quick actions"
        >
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-4 md:p-5" onClick={(event) => event.stopPropagation()}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search actions..."
              autoFocus
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />

            <div className="mt-3 space-y-2 max-h-[55vh] overflow-y-auto">
              {filtered.map(action => (
                <button
                  key={action.href + action.label}
                  onClick={() => {
                    setOpen(false)
                    router.push(action.href)
                  }}
                  className="w-full text-left rounded-xl border border-border bg-background px-4 py-3 hover:border-primary/40 hover:bg-surface-hover transition-colors"
                >
                  <p className="font-semibold text-sm text-foreground">{action.label}</p>
                  <p className="text-xs text-muted mt-0.5">{action.description}</p>
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="text-sm text-muted text-center py-6">No actions found for that search.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
