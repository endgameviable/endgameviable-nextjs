import Entry from '../interfaces/entry';
import { safeStringify } from '@/types/strings';
import { TextType } from '@/types/contentText';
import { JsonDataPage } from './fetchFromS3';
import { safeParseDateMillis } from '@/types/dates';
import { canonicalizeUrl } from '@/site/utilities';

// Convert the json returned from S3 endpoints to an Entry
export function jsonToEntry(json: JsonDataPage): Entry {
  let image: string | undefined = undefined;
  if (json.images) {
    image = json.images[0];
  }
  return {
    timestamp: safeParseDateMillis(safeStringify(json.date)),
    route: canonicalizeUrl(safeStringify(json.link)),
    summary: new TextType(safeStringify(json.summary), 'text/plain'),
    article: new TextType(safeStringify(json.content), 'text/html'),
    title: json.title,
    type: json.type,
    image: image,
  };
}

export function jsonToEntries(dataPages: JsonDataPage[]): Entry[] {
  const entries: Entry[] = [];
  for (const jsonPage of dataPages) {
    const entry = jsonToEntry(jsonPage);
    entries.push(entry);
  }
  return entries;
}
