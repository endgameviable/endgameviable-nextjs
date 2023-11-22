import { safeStringify } from '@/types/strings';
import Entry, { EntrySocialData } from '../interfaces/entry';
import { TextType } from '@/types/contentText';
import { JsonDataPage } from './fetchFromS3';
import { safeParseDateMillis } from '@/types/dates';

// Convert the json returned from S3 endpoints to an Entry
export function jsonToEntry(json: JsonDataPage): Entry {
  let socialData: EntrySocialData = {};
  if (json.mastodon_status) {
    socialData.mastodon_instance = json.mastodon_status.instance;
    socialData.mastodon_status_id = json.mastodon_status.id;
  }
  return {
    timestamp: safeParseDateMillis(safeStringify(json.date)),
    route: safeStringify(json.link),
    summary: new TextType(safeStringify(json.summary), 'text/plain'),
    article: new TextType(safeStringify(json.content), 'text/html'),
    title: json.title,
    type: json.type,
    social: socialData,
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
