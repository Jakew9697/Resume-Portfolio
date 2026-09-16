import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap { return ['', 'prospects/', 'helga/', 'receptionist/', 'documents/', 'rfp/', 'cms/'].map(path => ({ url: `https://jakeworsham.syncgr.com/${path}` })); }
