// Resource configuration for the site (mostly AWS)

import { safeStringify } from '@/types/strings';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQSClient } from "@aws-sdk/client-sqs";

// AWS credentials
// Note: This is a general service account, not just for S3
// The env var name cannot begin with "AWS_"
export const awsAccessKeyId = safeStringify(process.env.S3_ACCESS_KEY_ID);
const awsSecretAccessKey = safeStringify(process.env.S3_SECRET_ACCESS_KEY);

// Mastodon API credentials
export const mastodonApiToken = safeStringify(process.env.MASTODON_API_TOKEN);

// DynamoDB table which maps post urls to e.g. activityPub status IDs
// This lets us link posts to notifications so that we can track
// external mentions from e.g. Mastodon.
// Using a table like this lets us write a notification
// application which detects new posts, sends an ActivityPub note,
// then adds an entry to the table, which is then picked up
// by the client-side component that renders mentions.
export const notificationTableName = 'endgameviable-post-notifications';

// A DynamoDB table name containing searchable post data.
// This drives the search api.
export const searchContentTableName = 'endgameviable-generated-posts';

// An S3 bucket which contains json content data.
// Essentially it's a static version of a web site,
// except every page is json instead of html.
// This content is built with the Hugo project endgameviable-json.
// Every checkin of new content triggers a rebuild of the s3 bucket.
export const contentBucketName = 'endgameviable-nextjs-storage';

// An SQS queue endpoint where site events are sent
// for processing. e.g. webmentions.
export const sqsEventQueuName = 'https://sqs.us-east-1.amazonaws.com/205454771271/endgameviable-event-queue';

// Normally we would use credentials: fromNodeProviderChain().
// fromNodeProviderChain() attempts to read credentials
// from a series of standard locations in the runtime environment.
// But we cannot set the standard environment variables
// in the AWS Amplify Console because all vars starting
// with "AWS_" are reserved. Therefore we have to use
// differently-named environment variables from the standard,
// so we have to set the credential keys manually like this.

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  }
});

export const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  }
});

export const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  }
});
