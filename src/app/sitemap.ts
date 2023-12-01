import { thisSiteUrl } from '@/site/utilities';
import { getContentAtRoute } from '@config/resourceConfig';

// sitemap.xml
export default async function Sitemap() {
    const allPages = await getContentAtRoute(['_pagemap']);
    if (allPages.children) {
        return allPages.children.map((entry) => ({
            url: thisSiteUrl(entry.route),
            lastModified: new Date(entry.timestamp),
        }));
    }
    return [];
}
