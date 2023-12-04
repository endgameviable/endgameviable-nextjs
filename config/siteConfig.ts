// Very high level site configuration.

export interface siteMetaData {
  siteName: string;
  siteHost: string;
  homePage: string;
  canonicalHostName: string;
  feedBeginsAt: string;
};

// Site Branding
export const siteConfig: siteMetaData = {
  siteName: 'Endgame Viable Next.js Beta',
  // This is where the site is actually hosted:
  siteHost: 'nextjs.endgameviable.com',
  // Url listed as where users should go
  homePage: 'https://endgameviable.com',
  // This is the hostname used to lookup pages in the dynamoDB mapping table.
  // (This lets us run the old site and the new site in parallel.)
  canonicalHostName: 'endgameviable.com',
  // Date at which feed items will begin broadcasting.
  // Items prior to this will not be generated in the feed.
  // Assists in switching users from old site with old feed to new.
  feedBeginsAt: '2023-11-30T00:00:00Z',
};

// Default limit to rss feeds and list pages
export const PAGE_SIZE: number = 25;

