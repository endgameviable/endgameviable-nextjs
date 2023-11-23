import Entry from '@/data/interfaces/entry';
import EntryQueryParams from '@/data/interfaces/queryFilter';
import { PAGE_SIZE } from '@config/siteConfig';
import { safeStringify } from '@/types/strings';
import { TextType } from '@/types/contentText';

// TODO: Search isn't functional yet.
// Originally this scanned all the content,
// but it seems less feasible to scan a whole S3 bucket.
// I have tentative plans to try an AWS ElasticSearch.

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

  // TODO - the searching
  allEntries.push({
    route: '/',
    title: 'Sorry',
    summary: new TextType("Search isn't implemented yet."),
    article: new TextType("Search isn't implemented yet."),
    timestamp: Date.now(),
  })
  
  // Sort by date descending
  allEntries.sort((b, a) => a.timestamp - b.timestamp);

  const elapsed = performance.now() - startTime;
  console.log(`returning ${allEntries.length} entries queried in ${elapsed}ms`);
  return Response.json(allEntries.slice(0, PAGE_SIZE));
}
