import { getBlogPosts, getCategories } from '@/data/blog'
import BlogIndexClient from './blog-index-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Recovery Guides & Resources',
  description: 'Science-backed guides on breaking compulsive habits, dopamine detox, porn recovery, doomscrolling, and building discipline.',
  openGraph: {
    title: 'StopGoon Blog - Recovery Guides & Resources',
    description: 'Science-backed guides on breaking compulsive habits, dopamine detox, and building discipline.',
  },
}

export default function BlogIndexPage() {
  const posts = getBlogPosts()
  const categories = getCategories()
  const featured = posts[0]

  const previews = posts.map(({ content: _, ...rest }) => rest)

  return <BlogIndexClient posts={previews} categories={categories} featured={featured} />
}
