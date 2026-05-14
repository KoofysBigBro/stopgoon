'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Search, Clock, Tag } from 'lucide-react'
import { getBlogPosts, getCategories } from '@/data/blog'

export default function BlogIndexPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const posts = getBlogPosts()
  const categories = getCategories()

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
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2.5 text-foreground">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight font-heading">StopGoon Blog</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-heading">
            Resources for <span className="text-primary">Recovery</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl">
            Science-backed strategies to help you break compulsive loops, overcome doomscrolling, and build lasting discipline.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !activeCategory
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted">No articles found matching your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null) }}
              className="mt-4 text-primary hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-surface border border-border hover:border-primary/30 rounded-3xl p-8 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTime}
                  </span>
                  <span className="text-sm text-muted font-medium">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs text-muted bg-background px-2 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
