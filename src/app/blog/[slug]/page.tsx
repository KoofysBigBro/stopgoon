import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { getBlogPostBySlug, getRelatedPosts } from '@/data/blog'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Article Not Found | StopGoon' }
  return {
    title: `${post.title} | StopGoon Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getBlogPostBySlug(slug)
  const related = getRelatedPosts(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 w-full z-50 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Blog</span>
          </Link>
          <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <article>
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readingTime}
              </span>
              <span>{article.date}</span>
              <span>By {article.author}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-heading leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-muted leading-relaxed border-l-4 border-primary/30 pl-4">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {article.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs text-muted bg-surface border border-border px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-16 pt-8 border-t border-border/50 text-center">
            <h3 className="text-2xl font-bold font-heading mb-4">Ready to take control?</h3>
            <p className="text-muted mb-6 max-w-md mx-auto">
              Join thousands of people using StopGoon to break compulsive habits and build lasting discipline.
            </p>
            <Link
              href="/register"
              className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25"
            >
              Start Your Free Recovery Journey
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold font-heading mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-surface border border-border hover:border-primary/30 rounded-2xl p-6 transition-all hover:shadow-lg"
                >
                  <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        .prose-custom h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
          color: var(--foreground);
        }
        .prose-custom h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-family: var(--font-heading);
          color: var(--foreground);
        }
        .prose-custom p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: var(--foreground);
        }
        .prose-custom ul, .prose-custom ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .prose-custom li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
          color: var(--foreground);
        }
        .prose-custom ul li {
          list-style-type: disc;
        }
        .prose-custom ol li {
          list-style-type: decimal;
        }
        .prose-custom strong {
          font-weight: 700;
          color: var(--primary);
        }
        .prose-custom blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-style: italic;
          color: var(--muted);
          font-size: 1.125rem;
        }
        .prose-custom a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-custom code {
          background: var(--surface);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.875em;
        }
      `}</style>
    </div>
  )
}
