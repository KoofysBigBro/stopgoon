'use client'

import { useState } from 'react'
import { playPop, playSuccess } from '@/utils/sound'

const REACTIONS = [
  { emoji: '🔥', label: 'Fire', color: 'from-orange-500/20 to-red-500/20' },
  { emoji: '💪', label: 'Strong', color: 'from-blue-500/20 to-cyan-500/20' },
  { emoji: '🧠', label: 'Smart', color: 'from-purple-500/20 to-violet-500/20' },
  { emoji: '❤️', label: 'Love', color: 'from-rose-500/20 to-pink-500/20' },
  { emoji: '💡', label: 'Insight', color: 'from-yellow-500/20 to-amber-500/20' },
]

export default function ReactionButtons() {
  const [selected, setSelected] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({
    '🔥': 47, '💪': 32, '🧠': 28, '❤️': 19, '💡': 41,
  })

  const handleReact = (emoji: string) => {
    if (selected === emoji) {
      setSelected(null)
      setCounts(c => ({ ...c, [emoji]: c[emoji] - 1 }))
      playPop()
    } else {
      if (selected) {
        setCounts(c => ({ ...c, [selected]: c[selected] - 1 }))
      }
      setSelected(emoji)
      setCounts(c => ({ ...c, [emoji]: c[emoji] + 1 }))
      playSuccess()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted font-medium">How was this article?</span>
      <div className="flex flex-wrap gap-1.5">
        {REACTIONS.map(r => {
          const active = selected === r.emoji
          return (
            <button
              key={r.emoji}
              onClick={() => handleReact(r.emoji)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                active
                  ? `bg-gradient-to-r ${r.color} border border-foreground/20 scale-110 shadow-sm`
                  : 'bg-surface border border-border hover:border-foreground/20 hover:scale-105'
              }`}
            >
              <span className="text-lg">{r.emoji}</span>
              <span className="text-xs font-medium tabular-nums text-muted">{counts[r.emoji]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
