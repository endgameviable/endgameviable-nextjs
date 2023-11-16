import Entry from '@/data/interfaces/entry';
import { fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntries } from '@/data/s3/jsonToEntry';
import { s3client } from '@config/siteConfig';

export async function generateLatestEntries(): Promise<Entry[]> {
  const jsonData = await fetchJsonFromS3(s3client, []);
  return jsonToEntries(jsonData.pages);
}
