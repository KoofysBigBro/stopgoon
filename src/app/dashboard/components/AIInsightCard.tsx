'use client'

import { useEffect, useState } from 'react'
import { Zap, Loader2, RefreshCw, Brain } from 'lucide-react'
import PremiumCardOverlay from '@/components/premium/PremiumCardOverlay'

interface AIInsightCardProps {
  isPremium: boolean
}

export default function AIInsightCard({ isPremium }: AIInsightCardProps) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsight = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Analyze my recent data and give me a personalized insight about my recovery patterns. Be specific, warm, and keep it to 2-3 sentences.',
        }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to load insight')
      }
      const { text } = await res.json()
      setInsight(text)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isPremium) {
      fetchInsight()
    }
  }, [isPremium])

  if (!isPremium) {
    return (
      <PremiumCardOverlay
        title="Predictive AI Insights"
        description="Stop relapses before they happen. Our AI analyzes your tracking data to predict your highest-risk windows."
        feature="AI-Powered Pattern Recognition"
        icon={<Brain className="w-7 h-7 text-white" />}
        variant="indigo"
      >
        <div className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">AI Predictive Insight</h4>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Based on your history, your urges peak on Day 7 around 10 PM. Consider starting a proactive focus routine to lower dopamine levels.
            </p>
          </div>
        </div>
      </PremiumCardOverlay>
    )
  }

  return (
    <div className="relative rounded-2xl border border-border/40 bg-surface/60 overflow-hidden group">
      <div className="p-5 md:p-6 flex items-start gap-4 relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-accent/20 bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300">
          <Brain className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <h4 className="font-semibold text-sm text-foreground">AI Predictive Insight</h4>
            <button
              onClick={fetchInsight}
              disabled={loading}
              title="Refresh insight"
              className="text-muted hover:text-accent transition-colors disabled:opacity-40 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading && !insight && (
            <div className="flex items-center gap-2 text-sm text-muted mt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your patterns…
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

          {insight && !loading && (
            <p className="text-sm text-muted mt-1 leading-relaxed">{insight}</p>
          )}
        </div>
      </div>
    </div>
  )
}
