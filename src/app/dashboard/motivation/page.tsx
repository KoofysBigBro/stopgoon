'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Sparkles, Plus, Trash2, Quote, Video, Target, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import PremiumCardOverlay from '@/components/premium/PremiumCardOverlay'

const DAILY_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "You are not your urges. You are the awareness that observes them.",
  "Every time you resist, your brain rewires itself to become stronger.",
  "Don't trade your long-term goals for short-term gratification.",
  "The pain of discipline is nothing compared to the pain of regret.",
  "Recovery is not a race. It's a lifelong commitment to yourself.",
  "Your mind is a muscle. The more you exercise self-control, the stronger it gets.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Fall down seven times, stand up eight.",
  "You don't have to control your thoughts. You just have to stop letting them control you."
]

const VIDEOS = [
  { embed: "https://www.youtube.com/embed/tbnzAVRZ9Xc?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=tbnzAVRZ9Xc", title: "Denzel Washington – Fall Forward" },
  { embed: "https://www.youtube.com/embed/D1R-jKKp3NA?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=D1R-jKKp3NA", title: "Steve Jobs – Stay Hungry, Stay Foolish" },
  { embed: "https://www.youtube.com/embed/pDnOHCpPdNk?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=pDnOHCpPdNk", title: "Discipline Over Motivation" },
  { embed: "https://www.youtube.com/embed/O-cawByg2aA?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=O-cawByg2aA", title: "Dopamine Nation – Take Control" },
  { embed: "https://www.youtube.com/embed/q06YIWCR2Js?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=q06YIWCR2Js", title: "How to Build Self-Control" },
  { embed: "https://www.youtube.com/embed/PZ7lDrwYdZc?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=PZ7lDrwYdZc", title: "Stop Wasting Time – Andrew Huberman" },
  { embed: "https://www.youtube.com/embed/Kgm_p_LjKQk?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=Kgm_p_LjKQk", title: "Atomic Habits in 12 Minutes" },
  { embed: "https://www.youtube.com/embed/VlAMvlKKVe8?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=VlAMvlKKVe8", title: "Why Most People Never Change" },
  { embed: "https://www.youtube.com/embed/ZC29SFMb4MA?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=ZC29SFMb4MA", title: "The Cost of Comfort" },
  { embed: "https://www.youtube.com/embed/IdTMDpizis8?rel=0&modestbranding=1", watch: "https://www.youtube.com/watch?v=IdTMDpizis8", title: "Jocko Willink – Discipline Equals Freedom" },
]

export default function MotivationPage() {
  const supabase = createClient()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reasons, setReasons] = useState<string[]>([])
  const [newReason, setNewReason] = useState('')
  const [videoIndex, setVideoIndex] = useState(-1)
  const [videoFailed, setVideoFailed] = useState(false)

  const today = new Date()
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
  const dailyQuote = DAILY_QUOTES[dayIndex % DAILY_QUOTES.length]

  useEffect(() => {
    setVideoIndex(dayIndex % VIDEOS.length)
  }, [dayIndex])

  const currentVideo = videoIndex >= 0 ? VIDEOS[videoIndex] : null

  useEffect(() => {
    setVideoFailed(false)
  }, [videoIndex])

  useEffect(() => {
    loadData()
  }, [])

  const goToPrev = () => {
    setVideoIndex(i => (i - 1 + VIDEOS.length) % VIDEOS.length)
  }

  const goToNext = () => {
    setVideoIndex(i => (i + 1) % VIDEOS.length)
  }

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('users')
      .select('subscription_tier, reasons_to_quit')
      .eq('id', user.id)
      .single()

    setIsPremium(profile?.subscription_tier === 'premium')
    setReasons(profile?.reasons_to_quit || [])
    setLoading(false)
  }

  const addReason = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReason.trim()) return

    const updatedReasons = [...reasons, newReason.trim()]
    setReasons(updatedReasons)
    setNewReason('')

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ reasons_to_quit: updatedReasons }).eq('id', user.id)
    }
  }

  const removeReason = async (index: number) => {
    const updatedReasons = reasons.filter((_, i) => i !== index)
    setReasons(updatedReasons)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ reasons_to_quit: updatedReasons }).eq('id', user.id)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-96 bg-surface rounded-2xl" />
  }

  if (!isPremium) {
    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-amber-500 mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8" /> Premium Motivation
          </h1>
          <p className="text-xl text-muted">Fuel your recovery with daily insights and your personal &ldquo;Why&rdquo;.</p>
        </header>

        <div className="h-[500px]">
          <PremiumCardOverlay
            title="Unlock Your Daily Fuel"
            description="Get access to curated daily motivation videos, powerful quotes, and a private vision board of your personal reasons to stay clean."
            feature="Daily Motivation Hub"
            icon={<Heart className="w-7 h-7 text-white" />}
            variant="amber"
          >
            <div className="p-6">
              <div className="flex gap-6 mb-8">
                <div className="flex-1 bg-background border rounded-2xl p-6 h-40"></div>
                <div className="flex-1 bg-background border rounded-2xl p-6 h-40"></div>
              </div>
              <div className="w-full bg-background border rounded-2xl p-6 h-64"></div>
            </div>
          </PremiumCardOverlay>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2 text-amber-500">
          <Sparkles className="w-6 h-6" /> Daily Motivation
        </h1>
        <p className="text-muted text-lg">Your daily dose of fuel to keep going.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Quote */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Quote className="w-32 h-32" />
          </div>
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">Quote of the Day</p>
          <h2 className="text-2xl font-bold leading-tight relative z-10 italic">
            "{dailyQuote}"
          </h2>
        </div>

        {/* My Reasons */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold">My Reasons to Quit</h2>
          </div>
          
          <form onSubmit={addReason} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Why are you doing this? (e.g. To be a better father)"
              className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!newReason.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
            {reasons.length === 0 ? (
              <p className="text-center text-muted py-6 text-sm">You haven't added any reasons yet. Write down your "Why" above.</p>
            ) : (
              reasons.map((reason, i) => (
                <div key={i} className="flex items-center justify-between bg-background border border-border rounded-lg p-3 group hover:border-indigo-500/30 transition-colors">
                  <p className="font-medium text-sm text-foreground">{reason}</p>
                  <button
                    onClick={() => removeReason(i)}
                    className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Daily Video */}
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-red-500" />
            <div>
              <h2 className="text-xl font-bold">Motivation Video</h2>
              <p className="text-sm text-muted">Tap "Next" if a video doesn't load properly.</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
              title="Previous video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-muted font-medium tabular-nums w-12 text-center">
              {videoIndex + 1} / {VIDEOS.length}
            </span>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
              title="Next video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-background border border-border shadow-inner relative">
          {currentVideo && (
            <iframe
              key={videoIndex}
              width="100%"
              height="100%"
              src={currentVideo.embed}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  )
}
