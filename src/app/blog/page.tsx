import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

// Placeholder blog data - ideally this comes from a CMS or MDX files later
const BLOG_POSTS = [
  {
    slug: 'dopamine-detox-guide',
    title: 'The Ultimate Dopamine Detox Guide: Rewire Your Brain in 2026',
    excerpt: 'Learn how to reset your dopamine receptors, break compulsive digital habits, and reclaim your attention span without toxic hustle culture.',
    date: new Date().toLocaleDateString(),
    category: 'Science & Health'
  },
  {
    slug: 'stop-doomscrolling',
    title: 'How to Stop Doomscrolling Late at Night',
    excerpt: 'A practical, science-backed approach to putting your phone away at night and getting your sleep schedule back on track.',
    date: new Date().toLocaleDateString(),
    category: 'Practical Habits'
  },
  {
    slug: 'anti-streak-philosophy',
    title: 'Why "Don\'t Break the Streak" is Terrible Advice for Addiction Recovery',
    excerpt: 'The "What the Hell" effect destroys progress. Learn why tracking days of growth is scientifically superior to maintaining perfect streaks.',
    date: new Date().toLocaleDateString(),
    category: 'Mindset'
  }
]

export const metadata = {
  title: 'Blog & Resources | StopGoon',
  description: 'Articles, science, and guides on overcoming compulsive digital habits, dopamine detoxing, and rebuilding focus.',
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2.5 text-foreground">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon Blog</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-heading">
            Resources for <span className="text-indigo-500">Recovery</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl">
            Science-backed strategies to help you break compulsive loops, overcome doomscrolling, and build lasting discipline.
          </p>
        </header>

        <div className="grid gap-8">
          {BLOG_POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group block bg-surface border border-border hover:border-indigo-500/30 rounded-3xl p-8 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-muted font-medium">{post.date}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-muted leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
