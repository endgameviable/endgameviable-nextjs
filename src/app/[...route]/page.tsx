import EntryListLayout from '@/components/server/entryList';
import SingleEntryPage from '@/components/server/entrySinglePage';
import MicroPostEntryLayout from '@/components/server/entryMicropost';
import { JsonDataEndpoint, fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntries, jsonToEntry } from '@/data/s3/jsonToEntry';
import { getS3Client } from '@config/siteConfig';
import { safeStringify } from '@/types/strings';

// This is the main dynamic route page endpoint.
// Basically any site links that aren't the home page
// will end up here.
// This implementation fetches json data for pages
// from an S3 bucket item with the same route as the url.

// A Hugo project named endgameviable-json renders
// the Markdown content files into json data files
// and copies the results to the s3 bucket.

type pageParams = {
  route: string[];
}

// generateStaticRoutes() provides a list of
// page routes to create statically at build time.
// We fetch a list of pages and sections from
// the s3 bucket, and return a list of all of
// them so that the majority of the site's
// landing pages are created staticially.
// (Currently this is over 1500 static pages.)

export async function generateStaticParams() {
  const params: pageParams[] = [];
  // _sectionmap is a list of content sections in the blog
  const allSections = await fetchJsonFromS3(getS3Client(), ['_sectionmap']);
  for (const page of allSections.pages) {
    if (page.link) {
      const route = transformRoute(page.link);
      params.push({route: route.split('/')});
    }
  }
  // _pagemap is a list of all content pages in the blog
  const allPages = await fetchJsonFromS3(getS3Client(), ['_pagemap']);
  for (const page of allPages.pages) {
    if (page.link) {
      const route = transformRoute(page.link);
      params.push({route: route.split('/')});
    }
  }
  return params;
}

// Transform a relative page url as generated by Hugo
// into a dynamic route as used in Next.js.
// Strips the leading slash and removes 'index.json'.
// e.g. '/post/mypost/index.json' -> 'post/mypost'
function transformRoute(pageRoute: string): string {
  let route = pageRoute;
  if (route.startsWith('/')) {
    route = route.substring(1);
  }
  if (route.endsWith('/index.json')) {
    route = route.substring(0, route.length - '/index.json'.length);
  }
  return route;
}

// Detect which view component to use to render
// the given json page data.
// There are basically three kinds:
// - A section view, which is a list of posts
// - A post view, which is a single post article
// - A micropost view, which is a single microblog post
function getView(jsonData: JsonDataEndpoint): JSX.Element {
  let component: JSX.Element;
  if (jsonData.metadata.view === 'page') {
    const entry = jsonToEntry(jsonData.pages[0]);
    if (entry.type === 'micropost') {
      component = <MicroPostEntryLayout entry={entry} />;
    } else {
      component = <SingleEntryPage entry={entry} />;
    }
  } else {
    const entries = jsonToEntries(jsonData.pages);
    component = <EntryListLayout
      title={safeStringify(jsonData.metadata.section)}
      content={safeStringify(jsonData.metadata.heading)}
      list={entries} />;
  }
  return component;
}

// Fetch source data for the given route and render a page view.
// This is the main landing page for any permalinks.
export default async function Page({params}: { params: { route: string[] }}) {
  const startTime = performance.now();
  const jsonData = await fetchJsonFromS3(getS3Client(), params.route);
  const component = getView(jsonData);
  const elapsed = performance.now() - startTime;
  return (
    <main>
      {component}
      <footer>
        <p>Page was generated in {elapsed.toFixed(2)}ms from json content data.</p>
      </footer>
    </main>
  );
}
