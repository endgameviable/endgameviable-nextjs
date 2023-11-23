import { safeStringify } from '@/types/strings';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { awsAccessKeyId } from '@config/siteConfig';
import path from 'path';

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

export async function fetchJsonFromS3(
  s3: S3Client,
  route: string[],
): Promise<JsonDataEndpoint> {
  const key = path.join(route.join('/'), 'index.json');
  const params: GetObjectCommandInput = {
    Bucket: 'endgameviable-nextjs-storage',
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
