import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

// Dummy data for rendering the article. In production, fetch this from markdown or a DB.
const ARTICLES: Record<string, { title: string, content: string }> = {
  'dopamine-detox-guide': {
    title: 'The Ultimate Dopamine Detox Guide: Rewire Your Brain in 2026',
    content: `
      <h2>The Science of Dopamine</h2>
      <p>Dopamine is not the "pleasure" molecule—it is the "motivation" molecule. When you constantly flood your brain with cheap dopamine from doomscrolling, your baseline drops. This is why you feel unmotivated to do difficult tasks.</p>
      <h2>How to Detox Correctly</h2>
      <p>A true detox isn't about locking yourself in a dark room. It's about replacing high-dopamine activities (social media, compulsive habits) with low-dopamine, high-effort activities (reading, walking, deep work).</p>
      <p>Use StopGoon's urge tracking to identify the specific times of day your brain craves those cheap dopamine hits, and build a proactive routine to counter them.</p>
    `
  },
  'stop-doomscrolling': {
    title: 'How to Stop Doomscrolling Late at Night',
    content: `
      <h2>The Evening Trap</h2>
      <p>When you are tired, your prefrontal cortex (the part of your brain responsible for willpower) is exhausted. This makes 10 PM to 2 AM the highest-risk window for compulsive habits.</p>
      <h2>Actionable Fixes</h2>
      <ul>
        <li><strong>Physical Distance:</strong> Put your phone charger across the room.</li>
        <li><strong>The 10-Minute Rule:</strong> Tell yourself you can scroll, but you have to read a physical book for 10 minutes first. Usually, the urge passes.</li>
        <li><strong>Use the SOS Button:</strong> StopGoon's SOS feature is designed specifically to intercept these late-night urges with guided breathing.</li>
      </ul>
    `
  },
  'anti-streak-philosophy': {
    title: 'Why "Don\'t Break the Streak" is Terrible Advice for Addiction Recovery',
    content: `
      <h2>The "What the Hell" Effect</h2>
      <p>If you have a 60-day streak and you relapse, traditional counters drop back to zero. This induces immense shame. Psychologically, your brain says, "Well, the streak is broken, might as well binge."</p>
      <h2>Days of Growth > Streaks</h2>
      <p>StopGoon measures <strong>Days of Growth</strong>. If you were clean for 60 days, relapsed once, and then stayed clean for another 10 days, your growth is 70 days, not 10. A single lapse does not erase two months of brain rewiring.</p>
    `
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug]

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link href="/blog" className="text-indigo-500 hover:underline">Return to Blog</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Blog</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <article className="prose prose-invert prose-indigo prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 font-heading leading-tight">
            {article.title}
          </h1>
          <div className="text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <h3 className="text-2xl font-bold font-heading mb-4">Ready to take control?</h3>
          <Link href="/register" className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors">
            Start Your Free Recovery Journey
          </Link>
        </div>
      </main>
    </div>
  )
}
