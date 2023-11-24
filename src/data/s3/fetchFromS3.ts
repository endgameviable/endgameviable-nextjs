import path from 'path';
import Entry, { ERROR_ENTRY } from '../interfaces/entry';
import { safeStringify } from '@/types/strings';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getS3Client, s3ContentBucketName } from '@config/siteConfig';
import { canonicalizePath } from '@/site/utilities';
import { safeParseDateMillis } from '@/types/dates';
import { TextType } from '@/types/contentText';

interface HugoJsonPage {
  date?: string; // format: yyyy-mm-ddThh:mm:ss-zzzz
  title?: string;
  summary?: string;
  content?: string;
  link?: string;
  type?: string;
  alternates?: string[];
  images?: string[];
  children?: HugoJsonPage[];
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
      const data: HugoJsonPage = JSON.parse(s);
      if (data.children && data.children.length > 0) {
        // List page
        const children = jsonToEntries(data.children);
        return jsonToEntry(data, children);
      } else {
        // Single page
        return jsonToEntry(data, []);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return ERROR_ENTRY;
}

// Convert the json returned from S3 endpoints to an Entry
function jsonToEntry(json: HugoJsonPage, children: Entry[]): Entry {
  let image: string | undefined = undefined;
  if (json.images) {
    image = json.images[0];
  }
  return {
    timestamp: safeParseDateMillis(safeStringify(json.date)),
    route: canonicalizePath(safeStringify(json.link)),
    summary: new TextType(safeStringify(json.summary), 'text/plain'),
    article: new TextType(safeStringify(json.content), 'text/html'),
    title: json.title,
    type: json.type,
    image: image,
    children: children,
  };
}

function jsonToEntries(dataPages: HugoJsonPage[]): Entry[] {
  const entries: Entry[] = [];
  for (const jsonPage of dataPages) {
    const entry = jsonToEntry(jsonPage, []);
    entries.push(entry);
  }
  return entries;
}
