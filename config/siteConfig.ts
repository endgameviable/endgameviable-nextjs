// Very high level site configuration.

export interface siteMetaData {
  siteName: string;
  siteHost: string;
  siteUrl: string;
  routeHostName: string;
};

// Site Branding
export const siteConfig: siteMetaData = {
  siteName: 'Endgame Viable Next.js Beta',
  // This is where the site is actually hosted:
  siteHost: 'beta.endgameviable.com',
  siteUrl: 'https://beta.endgameviable.com',
  // This is the hostname used to lookup pages in the dynamoDB mapping table.
  // (This lets us run the old site and the new site in parallel.)
  routeHostName: 'https://endgameviable.com',
};

// Default limit to rss feeds and list pages
export const PAGE_SIZE: number = 25;

