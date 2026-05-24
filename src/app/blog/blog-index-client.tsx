'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Search, Clock, Tag, ChevronRight, Sparkles } from 'lucide-react'
import { playClick } from '@/utils/sound'
import BlogImage from '@/components/blog/BlogImage'

interface PostPreview {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readingTime: string
  tags: string[]
  image: string
}

export default function BlogIndexClient({ posts, categories, featured }: { posts: PostPreview[]; categories: string[]; featured: PostPreview }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !activeCategory || post.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [search, activeCategory])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50 transition-all">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2.5 text-foreground">
            <BookOpen className="w-6 h-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight font-heading">Blog</span>
          </div>
        </div>
      </nav>

      <main id="main-content" className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Science-backed recovery guides
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 font-heading">
            Resources for <span className="text-primary">Recovery</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Practical strategies, neuroscience, and mindset shifts to help you break compulsive loops and build lasting discipline.
          </p>
        </header>

        <Link
          href={`/blog/${featured.slug}`}
          className="group block relative mb-12 rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5"
        >
          <div className="aspect-[2/1] md:aspect-[3/1] relative">
            <BlogImage
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {featured.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted backdrop-blur-sm">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {featured.readingTime}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-sm text-muted max-w-2xl line-clamp-2">
              {featured.excerpt}
            </p>
          </div>
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search articles..."
              aria-label="Search articles"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory(null); playClick() }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !activeCategory
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border text-muted hover:text-foreground hover:border-foreground/30'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat === activeCategory ? null : cat); playClick() }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-border text-muted hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-xl text-muted">No articles found matching your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null) }}
              className="mt-4 text-primary hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {(activeCategory || search ? filtered : filtered.slice(1)).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-surface border border-border hover:border-primary/30 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <BlogImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 text-[10px] text-muted bg-background px-2 py-0.5 rounded-full">
                        <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-indigo-500/5 to-accent/5 border border-primary/10">
          <span className="text-4xl mb-4 block">💪</span>
          <h3 className="text-2xl font-bold font-heading mb-2">Ready to start your journey?</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Join thousands of people using StopGoon to break compulsive habits and build lasting discipline.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
          >
            Start Free Recovery <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  )
}
