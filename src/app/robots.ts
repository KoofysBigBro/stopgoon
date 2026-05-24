import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://stopgoon.xyz'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api', '/onboarding', '/update-password', '/forgot-password'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
