import Entry from '@/data/interfaces/entry';
import EntryListLayout from '@/components/server/entryList';
import SingleEntryPage from '@/components/server/entrySinglePage';
import MicroPostEntryLayout from '@/components/server/entryMicropost';
import { safeStringify } from '@/types/strings';
import { canonicalizePath, canonicalizeRoute } from '@/site/utilities';
import { getContentAtRoute } from '@/site/getContent';

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
  const allSections = await getContentAtRoute(['_sectionmap']);
  if (allSections.children) {
    for (const page of allSections.children) {
      if (page.route) {
        const route = canonicalizeRoute(page.route);
        params.push({route: route.split('/')});
      }
    }
  }
  // _pagemap is a list of all content pages in the blog
  const allPages = await getContentAtRoute(['_pagemap']);
  if (allPages.children) {
    for (const page of allPages.children) {
      if (page.route) {
        const route = canonicalizeRoute(page.route);
        params.push({route: route.split('/')});
      }
    }
  }
  return params;
}

// Detect which view component to use to render
// the given json page data.
// There are basically three kinds:
// - A section view, which is a list of posts
// - A post view, which is a single post article
// - A micropost view, which is a single microblog post
function getView(entry: Entry): JSX.Element {
  let component: JSX.Element;
  if (entry.children && entry.children.length > 0) {
    component = <EntryListLayout
      title={safeStringify(entry.title)}
      content={safeStringify(entry.article)}
      list={entry.children} />;
  } else {
    if (entry.type === 'micropost') {
      component = <MicroPostEntryLayout entry={entry} />;
    } else {
      component = <SingleEntryPage entry={entry} />;
    }
  }
  return component;
}

// Fetch source data for the given route and render a page view.
// This is the main landing page for any permalinks.
export default async function Page({params}: { params: { route: string[] }}) {
  const startTime = performance.now();
  const entry = await getContentAtRoute(params.route);
  const component = getView(entry);
  const elapsed = performance.now() - startTime;
  return (
    <main>
      {component}
      <footer>
        <p>Page was generated in {elapsed.toFixed(2)}ms.</p>
      </footer>
    </main>
  );
}
