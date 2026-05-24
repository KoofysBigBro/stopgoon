import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Tag, ChevronRight } from 'lucide-react'
import { getBlogPostBySlug, getRelatedPosts } from '@/data/blog'
import ReadingProgress from '@/components/blog/ReadingProgress'
import ReactionButtons from '@/components/blog/ReactionButtons'
import ArticleQuiz from '@/components/blog/ArticleQuiz'
import BlogImage from '@/components/blog/BlogImage'

function stripEmojiPrefix(title: string): string {
  return title.replace(/^[^\s]+\s/, '')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Article Not Found | StopGoon' }
  const cleanTitle = stripEmojiPrefix(post.title)
  return {
    title: `${cleanTitle} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: cleanTitle,
      description: post.excerpt,
      images: [{ url: post.image, width: 800, height: 400 }],
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: post.excerpt,
      images: [post.image],
    },
    keywords: post.tags.join(', '),
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getBlogPostBySlug(slug)
  const related = getRelatedPosts(slug)

  if (!article) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title.replace(/^[^\s]+\s/, ''),
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    author: { '@type': 'Person', name: article.author },
    keywords: article.tags.join(', '),
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <ReadingProgress />

      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold">Back to Blog</span>
          </Link>
          <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10">
        <BlogImage
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <main id="main-content" className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
        <article className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-lg">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {article.readingTime}
              </span>
              <span>{article.date}</span>
              <span>By {article.author}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 font-heading leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-muted leading-relaxed border-l-4 border-primary/30 pl-4 italic">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {article.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs text-muted bg-background border border-border px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Quiz */}
          {article.quiz && <ArticleQuiz quiz={article.quiz} />}

          {/* Reactions */}
          <div className="mt-10 pt-6 border-t border-border/50">
            <ReactionButtons />
          </div>

          {/* Share */}
          <div className="mt-6 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted font-medium">Share this article</p>
            <div className="flex gap-2">
              <ShareButton href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://stopgoon.xyz/blog/${article.slug}`)}`} label="X" ariaLabel="Share on X (formerly Twitter)" />
              <ShareButton href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://stopgoon.xyz/blog/${article.slug}`)}`} label="in" ariaLabel="Share on LinkedIn" />
              <ShareButton href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`https://stopgoon.xyz/blog/${article.slug}`)}`} label="✉" ariaLabel="Share via Email" />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 pt-6 border-t border-border/50 text-center">
            <span className="text-3xl mb-3 block">🌟</span>
            <h3 className="text-2xl font-bold font-heading mb-2">Ready to take control?</h3>
            <p className="text-muted mb-6 max-w-md mx-auto text-sm">
              Join thousands using StopGoon to break compulsive habits and build lasting discipline.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
            >
              Start Your Free Journey <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold font-heading mb-6">📚 More Articles You'll Love</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-surface border border-border hover:border-primary/30 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <BlogImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <h3 className="text-base font-bold mt-2 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .blog-content h2 {
          font-size: 1.65rem;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
        }
        .blog-content h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-family: var(--font-heading);
        }
        .blog-content p {
          margin-bottom: 1.2rem;
          line-height: 1.8;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .blog-content ul li { list-style-type: disc; }
        .blog-content ol li { list-style-type: decimal; }
        .blog-content strong { font-weight: 700; color: var(--primary); }
        .blog-content blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-style: italic;
          color: var(--muted);
          font-size: 1.1rem;
        }
        .blog-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
        .blog-content code {
          background: var(--surface);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.875em;
        }
      `}</style>
    </div>
  )
}

function ShareButton({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-surface border border-border hover:border-foreground/30 hover:bg-surface-hover flex items-center justify-center text-xs font-bold text-muted hover:text-foreground transition-all"
      aria-label={ariaLabel}
    >
      {label}
    </a>
  )
}
