import RSS from "rss";

/* rss feed for a category */
export async function GET(request: Request, { params }: { params: { source: string } }) {
  var feed = new RSS({
    title: params.source,
    description: '',
    site_url: '',
    feed_url: '',
    copyright: '',
    language: '',
    pubDate: '',
  });
  return new Response(feed.xml({ indent: true }), {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
      },
    });
  }