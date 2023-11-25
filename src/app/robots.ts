import { siteConfig } from '@config/siteConfig'
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/search/'],
    },
    sitemap: siteConfig.siteUrl + '/sitemap.xml',
  }
}