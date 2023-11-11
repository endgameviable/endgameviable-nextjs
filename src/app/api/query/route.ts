import Entry from '@/data/interfaces/entry';
import EntryQueryParams from '@/data/interfaces/queryFilter';
import { PAGE_SIZE, getSections } from '@config/siteConfig';
import { safeStringify } from '@/typeConversion';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const textFilter = safeStringify(searchParams.get('text'));
  console.log(`querying text=${textFilter}`);

  const startTime = performance.now();
  const filter: EntryQueryParams = {
    routeStartsWith: '',
    contains: textFilter,
  };
  console.log(filter);

  // Query for matching entries
  const allEntries: Entry[] = [];
  for (const section of getSections()) {
    var entries = await section.provider2.getEntries(filter);
    allEntries.push(...entries);
  }

  // Sort by date descending
  allEntries.sort((b, a) => a.timestamp - b.timestamp);

  const elapsed = performance.now() - startTime;
  console.log(`returning ${allEntries.length} entries queried in ${elapsed}ms`);
  return Response.json(allEntries.slice(0, PAGE_SIZE));
}
