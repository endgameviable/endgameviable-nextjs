import { safeStringify } from '@/types/strings';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { awsAccessKeyId, getS3Client, s3ContentBucketName } from '@config/siteConfig';
import path from 'path';
import Entry, { ERROR_ENTRY } from '../interfaces/entry';
import { canonicalizePath } from '@/site/utilities';
import { jsonToEntries, jsonToEntry } from './jsonToEntry';
import { safeParseDateMillis } from '@/types/dates';
import { TextType } from '@/types/contentText';

export interface JsonMetadata {
  view?: string;
  section?: string;
  heading?: string;
}

export interface JsonDataPage {
  date?: string; // format: yyyy-mm-ddThh:mm:ss-zzzz
  title?: string;
  summary?: string;
  content?: string;
  link?: string;
  type?: string;
  alternates?: string[];
  images?: string[];
}

export interface JsonDataEndpoint {
  metadata: JsonMetadata;
  pages: JsonDataPage[];
}

// Fetch JSON content data from an S3 bucket source
export async function fetchJsonFromS3(
  s3: S3Client,
  route: string[],
): Promise<JsonDataEndpoint> {
  const key = path.join(route.join('/'), 'index.json');
  const params: GetObjectCommandInput = {
    Bucket: s3ContentBucketName,
    Key: key,
  };
  try {
    const response = await s3.send(new GetObjectCommand(params));
    if (response.Body) {
      const s = await response.Body?.transformToString();
      return JSON.parse(s);
    }
    return {
      metadata: { view: 'page', section: 'error' },
      pages: [
        {
          title: 'Nothing Here',
          content: `<p>There's no content at ${key}.</p>`,
        },
      ],
    };
  } catch (error) {
    console.log('error loading file:', error);
    return {
      metadata: { view: 'page', section: 'error' },
      pages: [
        {
          title: 'An Error Occurred',
          content: `<p>There was an error fetching ${key}.</p><p><blockquote>${error}</blockquote></p><p>env: ${safeStringify(process.env.S3_ACCESS_KEY_ID).slice(0,5)}</p><p>window: ${typeof window}</p>`,
        },
      ],
    };
  }
}

export async function getContentAtRouteS3(route: string[]): Promise<Entry> {
  const key = path.join(route.join('/'), 'index.json');
  const params: GetObjectCommandInput = {
    Bucket: s3ContentBucketName,
    Key: key,
  };
  try {
    const response = await getS3Client().send(new GetObjectCommand(params));
    if (response.Body) {
      const s = await response.Body?.transformToString();
      const data: JsonDataEndpoint = JSON.parse(s);
      if (data.metadata.view === 'page') {
        return jsonToEntry(data.pages[0]);
      } else {
        return {
          timestamp: Date.now(), // TODO: should be section date
          route: canonicalizePath(route.join('/')),
          title: data.metadata.section,
          article: new TextType(data.metadata.heading, 'text/html'),
          children: jsonToEntries(data.pages),
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  return ERROR_ENTRY;
}
