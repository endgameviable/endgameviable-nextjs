import { generateFeed } from '@/site/generateFeed';

export async function GET() {
    const feed = await generateFeed();
    return new Response(feed.json1());
}
