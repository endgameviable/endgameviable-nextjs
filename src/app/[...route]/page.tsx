import SingleEntryLayout from '@/layouts/entrySingle';
import EntryListLayout from '@/layouts/entryList';
import MicroPostEntryLayout from '@/layouts/entryMicropost';
import Entry from '@/data/interfaces/entry';
import { JsonDataEndpoint, fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntries, jsonToEntry } from '@/data/s3/jsonToEntry';
import { getS3Client } from '@config/siteConfig';

// This implementation fetches json data for pages
// from an S3 bucket item with the same route as the url.
// Depends on rendering json data from markdown files,
// which is done by the Hugo project endgameviable-json.

// generateStaticRoutes should read sitemap.xml
// and generate a static page for each entry.
// Should also add a way to read an index of
// section list pages, too. Will have to
// generate those in the Hugo project.

type pageParams = {
  route: string[];
}

export async function generateStaticParams() {
  const params: pageParams[] = [];
  const allSections = await fetchJsonFromS3(getS3Client(), ['_sectionmap']);
  for (const page of allSections.pages) {
    if (page.link) {
      const route = getRoute(page.link);
      params.push({route: route.split('/')});
    }
  }
  const allPages = await fetchJsonFromS3(getS3Client(), ['_pagemap']);
  for (const page of allPages.pages) {
    if (page.link) {
      const route = getRoute(page.link);
      params.push({route: route.split('/')});
    }
  }
  return params;
}

function getRoute(pageRoute: string): string {
  let route = pageRoute;
  if (route.startsWith('/')) {
    route = route.substring(1);
  }
  if (route.endsWith('/index.json')) {
    route = route.substring(0, route.length - '/index.json'.length);
  }
  return route;
}

function getView(jsonData: JsonDataEndpoint): JSX.Element {
  let component: JSX.Element;
  if (jsonData.metadata.view === 'page') {
    const entry = jsonToEntry(jsonData.pages[0]);
    if (entry.type === 'micropost') {
      component = <MicroPostEntryLayout entry={entry} />;
    } else {
      component = <SingleEntryLayout entry={entry} />;
    }
  } else {
    const entries = jsonToEntries(jsonData.pages);
    component = <EntryListLayout content="{jsonData.metadata.heading}" list={entries} />;
  }
  return component;
}

// Renders either a single entry page or a list
export default async function Page({params}: { params: { route: string[] }}) {
  const startTime = performance.now();
  const jsonData = await fetchJsonFromS3(getS3Client(), params.route);
  const component = getView(jsonData);
  const elapsed = performance.now() - startTime;
  return (
    <main>
      <p>Page was generated in {elapsed.toFixed(2)}ms from json data fetched from S3!</p>
      {component}
    </main>
  );
}
