import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/', disallow: '/cms/published/' }, sitemap: 'https://jakeworsham.syncgr.com/sitemap.xml' }; }
