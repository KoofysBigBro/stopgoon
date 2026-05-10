'use client'

import { Crown, Flag, AlertCircle, BookOpen, UserPlus, Play } from 'lucide-react'
import Link from 'next/link'

interface TimelineEvent {
  id: string
  type: 'start' | 'relapse' | 'milestone' | 'journal'
  date: Date
  title: string
  description?: string
}

interface RecoveryTimelineProps {
  isPremium: boolean
  events: TimelineEvent[]
}

export default function RecoveryTimeline({ isPremium, events }: RecoveryTimelineProps) {
  if (!isPremium) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden h-[400px]">
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center p-6 text-center">
          <Crown className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-xl font-bold mb-1">Advanced Recovery Timeline</h3>
          <p className="text-sm text-muted max-w-md mb-4">
            Visualize your entire journey, spot long-term trends, and see exactly how far you've come.
          </p>
          <Link href="/dashboard/upgrade" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md">
            Unlock Premium
          </Link>
        </div>
        
        {/* Fake blurred timeline */}
        <div className="opacity-30 pointer-events-none filter blur-[3px]">
          <h3 className="font-bold text-lg mb-6">Your Journey</h3>
          <div className="space-y-6 pl-4 border-l-2 border-indigo-500/20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-surface border-2 border-indigo-500" />
                <p className="text-xs text-muted mb-1">Oct 12, 2023</p>
                <p className="font-bold">Reached 30 Days</p>
                <p className="text-sm">You hit a major milestone!</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'start': return <Play className="w-4 h-4 text-emerald-500" />
      case 'milestone': return <Flag className="w-4 h-4 text-indigo-500" />
      case 'relapse': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'journal': return <BookOpen className="w-4 h-4 text-amber-500" />
      default: return <UserPlus className="w-4 h-4 text-muted" />
    }
  }

  const getColorClass = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'start': return 'border-emerald-500'
      case 'milestone': return 'border-indigo-500'
      case 'relapse': return 'border-red-500'
      case 'journal': return 'border-amber-500'
      default: return 'border-border'
    }
  }

  if (events.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center text-muted shadow-sm">
        <p>Your journey is just beginning. Logs and milestones will appear here.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="font-bold text-lg mb-8 text-foreground">Your Recovery Journey</h3>
      
      <div className="relative border-l-2 border-border/50 ml-3 md:ml-4 space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative pl-6 md:pl-8 group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-surface border-2 flex items-center justify-center ${getColorClass(event.type)} transition-transform group-hover:scale-125`}>
            </div>
            
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(event.type)}
                  <h4 className="font-bold text-sm md:text-base">{event.title}</h4>
                </div>
                <span className="text-xs font-semibold text-muted whitespace-nowrap bg-surface-hover px-2 py-1 rounded-md">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-muted line-clamp-2">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
