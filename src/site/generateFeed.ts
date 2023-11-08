import { Feed } from "feed";
import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from "../data/interfaces/entry";
import { PAGE_SIZE, getSections, siteMetaData } from "@/site-config";
import { safeStringify } from "@/typeConversion";
import { MATCH_ALL_ENTRIES } from "../data/interfaces/queryFilter";
import { generateLatestEntries } from "./generateLatestEntries";

export async function generateFeed(): Promise<Feed> {
  const entries = await generateLatestEntries()
  const feed = new Feed({
    title: siteMetaData.siteName,
    description: `RSS feed for ${siteMetaData.siteName}`,
    id: siteMetaData.siteUrl,
    link: siteMetaData.siteUrl,
    feedLinks: {
      json: `${siteMetaData.siteUrl}/index.json`,
      rss: `${siteMetaData.siteUrl}/index.xml`
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
