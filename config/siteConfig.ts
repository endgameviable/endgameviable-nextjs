import { S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from "@aws-sdk/credential-providers";

// Very high level site configuration.

type metaData = {
  [key: string]: string;
};

// Site Branding
export const siteConfig: metaData = {
  siteName: 'Endgame Viable Next.js Beta',
  siteUrl: 'https://beta.endgameviable.com',
};

// Default limit to rss feeds and list pages
export const PAGE_SIZE: number = 10;

export const s3client = new S3Client({
  credentials: fromEnv(),
});
