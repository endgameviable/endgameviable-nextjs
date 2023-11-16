import Entry from '@/data/interfaces/entry';
import { fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntries } from '@/data/s3/jsonToEntry';
import { getS3Client } from '@config/siteConfig';

export async function generateLatestEntries(): Promise<Entry[]> {
  const jsonData = await fetchJsonFromS3(getS3Client(), []);
  return jsonToEntries(jsonData.pages);
}
