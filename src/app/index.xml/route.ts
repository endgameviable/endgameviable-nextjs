import Entry, { renderArticleAsHTML } from "@/data/interfaces/entry";
import { MATCH_ALL } from "@/data/interfaces/queryFilter";
import { PAGE_SIZE, getSections } from "@/site-config";
import { safeStringify } from "@/typeConversion";
import RSS from "rss";

export async function GET() {
  // Query for matching entries
  const entries: Entry[] = []
  for (const section of getSections()) {
      entries.push(...await section.provider.queryEntries(MATCH_ALL))
  }
  entries.sort((b, a) => a.timestamp - b.timestamp)

  const feed = new RSS({
    title: 'RSS Feed',
    description: 'RSS Feed',
    site_url: '',
    feed_url: '/index.xml',
    copyright: '',
    language: '',
    pubDate: '',
  });
  entries.slice(0, PAGE_SIZE).map((entry) => {
    feed.item({
      date: new Date(entry.timestamp),
      title: safeStringify(entry.title, "Untitled"),
      description: renderArticleAsHTML(entry),
      url: ""
    })
  })
  return new Response(feed.xml({ indent: true }), {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
      },
    });
  }