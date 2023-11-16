import { safeStringify } from '@/types/strings';
import Entry from '../interfaces/entry';
import { TextType } from '@/types/contentText';
import { JsonDataPage } from './fetchFromS3';
import { safeParseDateMillis } from '@/types/dates';

// Convert the json returned from S3 endpoints to an Entry
export function jsonToEntry(json: JsonDataPage): Entry {
  return {
    timestamp: safeParseDateMillis(safeStringify(json.date)),
    route: safeStringify(json.link),
    summary: new TextType(safeStringify(json.summary), 'text/html'),
    article: new TextType(safeStringify(json.content), 'text/html'),
    title: json.title,
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
