import { canonicalizeRoute } from '@/site/utilities';
import { getContentAtRoute } from '@/site/getContent';
import { standardPageComponent } from '@/site/standardPageView';

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
};

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
                params.push({ route: route.split('/') });
            }
        }
    }
    // _pagemap is a list of all content pages in the blog
    const allPages = await getContentAtRoute(['_pagemap']);
    if (allPages.children) {
        for (const page of allPages.children) {
            if (page.route) {
                const route = canonicalizeRoute(page.route);
                params.push({ route: route.split('/') });
            }
        }
    }
    return params;
}

// Fetch source data for the given route and render a page view.
// This is the main landing page for any permalinks.
export default async function Page({
    params,
}: {
    params: { route: string[] };
}) {
    return standardPageComponent(params.route);
}
