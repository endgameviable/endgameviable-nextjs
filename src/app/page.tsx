import { fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntries } from '@/data/s3/jsonToEntry';
import EntryListLayout from '@/layouts/entryList';
import { safeStringify } from '@/types/strings';
import { getS3Client } from '@config/siteConfig';

export default async function Home() {
  const jsonData = await fetchJsonFromS3(getS3Client(), []);
  const entries = jsonToEntries(jsonData.pages);
  const content = safeStringify(jsonData.metadata.heading);
  return (
    <main>
      <EntryListLayout content={content} list={entries} />
    </main>
  );
}
