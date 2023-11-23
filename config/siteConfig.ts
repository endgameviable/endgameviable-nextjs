import { safeStringify } from '@/types/strings';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Very high level site configuration.

export interface siteMetaData {
  siteName: string;
  siteUrl: string;
  routeHostName: string;
};

// Site Branding
export const siteConfig: siteMetaData = {
  siteName: 'Endgame Viable Next.js Beta',
  // This is where the site is actually hosted:
  siteUrl: 'https://beta.endgameviable.com',
  // This is the hostname used to lookup pages in the dynamoDB mapping table.
  // (This lets us run the old site and the new site in parallel.)
  routeHostName: 'https://endgameviable.com',
};

// Default limit to rss feeds and list pages
export const PAGE_SIZE: number = 25;

// DynamoDB table which maps post urls to e.g. activityPub status IDs
// This lets us link posts to notifications so that we can track
// external mentions from e.g. Mastodon.
// Using a table like this lets us write a notification
// application which detects new posts, sends an ActivityPub note,
// then adds an entry to the table, which is then picked up
// by the client-side component that renders mentions.
export const dynamoTableName = 'endgameviable-post-notifications';

// An S3 bucket which contains json content data.
// Essentially it's a static version of a web site,
// except every page is json instead of html.
// This content is built with the Hugo project endgameviable-json.
// Every checkin of new content triggers a rebuild of the s3 bucket.
export const s3ContentBucketName = 'endgameviable-nextjs-storage';

// Note: This is a general service account, not just for S3
// The env var name cannot begin with "AWS_"
export const awsAccessKeyId = safeStringify(process.env.S3_ACCESS_KEY_ID);
const awsSecretAccessKey = safeStringify(process.env.S3_SECRET_ACCESS_KEY);
export const mastodonApiToken = safeStringify(process.env.MASTODON_API_TOKEN);

// Normally we would use credentials: fromNodeProviderChain().
// fromNodeProviderChain() attempts to read credentials
// from a series of standard locations in the runtime environment.
// But we cannot set the standard environment variables
// in the AWS Amplify Console because all vars starting
// with "AWS_" are reserved. Therefore we have to use
// differently-named environment variables from the standard,
// so we have to set the credential keys manually like this.

// TODO: I think we can change this back to a constant
export function getS3Client(): S3Client {
  return new S3Client({
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    }
  });
}

export const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  }
});

