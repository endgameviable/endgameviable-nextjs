import { Feed } from "feed";
import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from "../data/interfaces/entry";
import { PAGE_SIZE, getSections, siteConfig } from "@config/site-config";
import { safeStringify } from "@/typeConversion";
import { MATCH_ALL_ENTRIES } from "../data/interfaces/queryFilter";
import { generateLatestEntries } from "./generateLatestEntries";

export async function generateFeed(): Promise<Feed> {
  const entries = await generateLatestEntries()
  const feed = new Feed({
    title: siteConfig.siteName,
    description: `RSS feed for ${siteConfig.siteName}`,
    id: siteConfig.siteUrl,
    link: siteConfig.siteUrl,
    feedLinks: {
      json: `${siteConfig.siteUrl}/index.json`,
      rss: `${siteConfig.siteUrl}/index.xml`
    },
    updated: new Date(),
    copyright: "Copyright" // TODO
  });
  entries.map((entry) => {
    feed.addItem({
      date: new Date(entry.timestamp),
      title: safeStringify(entry.title, "Untitled"),
      id: "", // TODO
      link: "", // TODO
      description: renderSummaryAsHTML(entry),
      content: renderArticleAsHTML(entry)
    })
  })
  return feed
}
