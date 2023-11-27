import PageContent from '@/data/interfaces/content';
import { getContentAtRoute } from './getContent';

export async function getAllLatestPosts(): Promise<PageContent[]> {
    const entry = await getContentAtRoute([]);
    return entry.children ? entry.children : [];
}
