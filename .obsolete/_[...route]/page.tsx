import SingleEntryLayout from '@/layouts/entrySingle';
import { PAGE_SIZE, forEachSection, getSectionInfo } from '@config/siteConfig';
import EntryListLayout from '@/layouts/entryList';
import { getFullRoute } from '@/data/interfaces/contentRoute';
import { initStaticConfig } from '@config/gitSync';

// This seems to be riddled with redundancies and inefficiences
// Not happy with this implementation.
// But the way the "catch-all" route works demands
// that everything be here.

export async function generateStaticParams() {
  console.log('generateStaticParams for catch-all route');
  await initStaticConfig(); // one-time, hopefully
  const params: { route: string[] }[] = [];
  const promises: Promise<string[]>[] = [];
  forEachSection((section) => {
    if (section.provider2) promises.push(section.provider2.getAllPaths());
  });
  const paths = await Promise.all(promises);
  const flattened: string[] = ([] as string[]).concat(...paths);
  //flattened.forEach((path) => params.push({ route: path.split('/') }));
  return params;
}

// Renders either a single entry page or a list
export default async function Page({
  params,
}: {
  params: { route: string[] };
}) {
  const source = params.route[0];
  const route = params.route.join('/');
  const sectionInfo = getSectionInfo(source);
  const startTime = performance.now();
  var component: JSX.Element;
  if (params.route.length === 1) {
    const entries = await sectionInfo.provider2.getAllEntries();
    entries.sort((b, a) => a.timestamp - b.timestamp);
    component = (
      <EntryListLayout content="List" list={entries.slice(0, PAGE_SIZE)} />
    );
  } else {
    // If the url matches a route, we return a single page
    // Otherwise we return a list of entries at that path
    const allRoutes = await sectionInfo.provider2.getAllRoutes();
    const match = allRoutes.find((e) => getFullRoute(e) === route);
    if (match !== undefined) {
      // A single entry route match
      const entry = await sectionInfo.provider2.getEntry(
        params.route.join('/'),
      );
      component = <SingleEntryLayout entry={entry} />;
    } else {
      // A list of entries matching the path
      const entries = await sectionInfo.provider2.getEntries({
        routeStartsWith: route,
        contains: '',
      });
      entries.sort((b, a) => a.timestamp - b.timestamp);
      component = (
        <EntryListLayout
          content="Sub-directory List"
          list={entries.slice(0, PAGE_SIZE)}
        />
      );
    }
  }
  const elapsed = performance.now() - startTime;
  console.log(`genereated page in ${elapsed.toFixed(2)}ms`);
  return (
    <main>
      <p>Content source: {source}</p>
      {component}
    </main>
  );
}
