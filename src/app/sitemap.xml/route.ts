import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/data/blog'

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const baseUrl = 'https://stopgoon.xyz'
  const now = new Date()

  const safeLastModified = (value: string | Date): string => {
    const parsed = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return now.toISOString()
    }
    const finalDate = parsed > now ? now : parsed
    return finalDate.toISOString()
  }

  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly', priority: '1.0' },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: '0.9' },
    { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/porn-recovery-tracker`, changeFrequency: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/quit-doomscrolling`, changeFrequency: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/refund`, changeFrequency: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: '0.3' },
  ]

  const blogPosts = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: safeLastModified(post.date),
    changeFrequency: 'monthly',
    priority: '0.6',
  }))

  const urls = [
    ...staticPages.map(p => ({ ...p, lastModified: now.toISOString() })),
    ...blogPosts
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (item) => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate',
    },
  })
}
