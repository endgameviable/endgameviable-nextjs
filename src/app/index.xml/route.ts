import { generateFeed } from "@/site/generateFeed";

export async function GET() {
  const feed = await generateFeed()
  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  })
}
