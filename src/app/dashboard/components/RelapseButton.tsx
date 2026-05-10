'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { RotateCcw, Loader2, AlertTriangle } from 'lucide-react'

export default function RelapseButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [note, setNote] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleRelapse = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      await supabase.from('relapses').insert({
        user_id: user.id,
        reason: note.trim() || 'No reason provided'
      })

      setIsOpen(false)
      setNote('')
      router.refresh()
    } catch {
      // ignore
    }
    setIsSubmitting(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-semibold text-muted hover:text-foreground transition-colors flex items-center justify-center gap-1.5 mt-6 mx-auto bg-surface hover:bg-surface-hover px-4 py-2 rounded-full border border-border"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Log a Relapse (Reset Count)
      </button>
    )
  }

  return (
    <div className="mt-8 text-left bg-red-500/5 border border-red-500/20 rounded-2xl p-5 max-w-sm mx-auto animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-2 mb-3 text-red-500">
        <AlertTriangle className="w-5 h-5" />
        <h4 className="font-bold">Log a Relapse</h4>
      </div>
      <p className="text-sm text-muted mb-4">
        Lapses happen. The most important thing is that you're honest about it. What triggered this?
      </p>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="I felt stressed because..."
        className="w-full bg-surface border border-border rounded-xl p-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-4 text-foreground placeholder:text-muted"
      />
      <div className="flex gap-2">
        <button
          onClick={handleRelapse}
          disabled={isSubmitting}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl text-sm transition-colors flex items-center justify-center"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Reset'}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          disabled={isSubmitting}
          className="flex-1 bg-surface border border-border hover:bg-surface-hover text-foreground font-semibold py-2 rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
