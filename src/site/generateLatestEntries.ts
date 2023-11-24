import Entry from '@/data/interfaces/entry';
import { getContentAtRoute } from './getContent';

export async function generateLatestEntries(): Promise<Entry[]> {
  const entry = await getContentAtRoute([]);
  return entry.children ? entry.children : [];
}
