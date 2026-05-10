'use client'

const MOOD_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  great: { emoji: '😊', label: 'Great', color: 'bg-emerald-500' },
  okay: { emoji: '😐', label: 'Okay', color: 'bg-indigo-500' },
  struggling: { emoji: '😔', label: 'Struggling', color: 'bg-amber-500' },
}

export default function MoodBreakdownChart({ moodCounts, totalCheckins }: { moodCounts: Record<string, number>; totalCheckins: number }) {
  const moods = Object.entries(moodCounts)

  if (moods.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-muted mb-2">Mood Breakdown</h4>
        <p className="text-xs text-muted">Check in daily to see your mood trends here.</p>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-muted mb-4">Mood Breakdown</h4>
      <div className="space-y-3">
        {moods.map(([mood, count]) => {
          const config = MOOD_CONFIG[mood] || { emoji: '❓', label: mood, color: 'bg-gray-500' }
          const pct = totalCheckins > 0 ? Math.round((count / totalCheckins) * 100) : 0
          return (
            <div key={mood}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span>{config.emoji}</span> {config.label}
                </span>
                <span className="text-muted font-semibold">{pct}%</span>
              </div>
              <div className="w-full bg-border/40 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${config.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
