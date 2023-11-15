import SingleEntryLayout from '@/layouts/entrySingle';
import EntryListLayout from '@/layouts/entryList';
import Entry from '@/data/interfaces/entry';
import { fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntry } from '@/data/s3/jsonToEntry';
import { s3client } from '@config/siteConfig';

// This implementation fetches json data for pages
// from an S3 bucket item with the same route as the url.
// Depends on rendering json data from markdown files,
// which is done by the Hugo project endgameviable-json.

// generateStaticRoutes should read sitemap.xml
// and generate a static page for each entry.
// Should also add a way to read an index of
// section list pages, too. Will have to
// generate those in the Hugo project.

// Renders either a single entry page or a list
export default async function Page({
  params,
}: {
  params: { route: string[] };
}) {
  var component: JSX.Element;
  const startTime = performance.now();
  const jsonData = await fetchJsonFromS3(s3client, params.route);
  if (jsonData.metadata.content === "single") {
    const entry = jsonToEntry(jsonData.pages[0]);
    component = <SingleEntryLayout entry={entry} />;
  } else {
    const entries: Entry[] = [];
    for (const jsonPage of jsonData.pages) {
      const entry = jsonToEntry(jsonPage);
      entries.push(entry);
    }
    component = (
      <EntryListLayout content="List" list={entries} />
    );
  }
  const elapsed = performance.now() - startTime;
  console.log(`generated ${params.route.join('/')} page in ${elapsed.toFixed(2)}ms`);
  return (
    <main>
      <p>Content fetched from S3 json data</p>
      {component}
    </main>
  );
}
