import { Feed } from 'feed';
import {
  renderArticleAsHTML,
  renderSummaryAsHTML,
} from '../data/interfaces/entry';
import { PAGE_SIZE, siteConfig } from '@config/siteConfig';
import { safeStringify } from '@/typeConversion';
import { generateLatestEntries } from './generateLatestEntries';

export async function generateFeed(): Promise<Feed> {
  const entries = await generateLatestEntries();
  entries.sort((b, a) => a.timestamp - b.timestamp);
  const feed = new Feed({
    title: siteConfig.siteName,
    description: `RSS feed for ${siteConfig.siteName}`,
    id: siteConfig.siteUrl,
    link: siteConfig.siteUrl,
    feedLinks: {
      json: `${siteConfig.siteUrl}/index.json`,
      rss: `${siteConfig.siteUrl}/index.xml`,
    },
    updated: new Date(),
    copyright: 'Copyright', // TODO
  });
  entries.slice(0, PAGE_SIZE).map((entry) => {
    feed.addItem({
      date: new Date(entry.timestamp),
      title: safeStringify(entry.title, 'Untitled'),
      id: '', // TODO
      link: '', // TODO
      description: renderSummaryAsHTML(entry),
      content: renderArticleAsHTML(entry),
    });
  });
  return feed;
}
