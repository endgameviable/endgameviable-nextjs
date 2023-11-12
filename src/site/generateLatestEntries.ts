import Entry from '@/data/interfaces/entry';
import { PAGE_SIZE, forEachSection } from '@config/siteConfig';

export async function generateLatestEntries(): Promise<Entry[]> {
  const entries: Entry[] = [];
  // TODO: parallelize this
  forEachSection(async (section) => {
    entries.push(...(await section.provider2.getAllEntries()));
  });
  entries.sort((b, a) => a.timestamp - b.timestamp);
  return entries.slice(0, PAGE_SIZE);
}
