import { safeStringify } from '@/types/strings';
import { S3Client } from '@aws-sdk/client-s3';

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

export const awsAccessKeyId = safeStringify(process.env.S3_ACCESS_KEY_ID);
const awsSecretAccessKey = safeStringify(process.env.S3_SECRET_ACCESS_KEY);

// Normally we would use credentials: fromNodeProviderChain().
// fromNodeProviderChain() attempts to read credentials
// from a series of standard locations in the runtime environment.
// But we cannot set the standard environment variables
// in the AWS Amplify Console because all vars starting
// with "AWS_" are reserved. Therefore we have to use
// differently-named environment variables from the standard,
// so we have to set the credential keys manually like so:
export function getS3Client(): S3Client {
  return new S3Client({
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    }
  });
}