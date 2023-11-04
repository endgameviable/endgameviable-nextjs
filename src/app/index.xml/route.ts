import RSS from "rss";

export async function GET() {
  var feed = new RSS({
    title: '',
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