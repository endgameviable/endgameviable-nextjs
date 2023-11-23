import { fetchJsonFromS3 } from '@/data/s3/fetchFromS3';
import { jsonToEntries } from '@/data/s3/jsonToEntry';
import EntryListLayout from '@/components/server/entryList';
import { safeStringify } from '@/types/strings';
import { getS3Client, siteConfig } from '@config/siteConfig';

export default async function Home() {
  const jsonData = await fetchJsonFromS3(getS3Client(), []);
  const entries = jsonToEntries(jsonData.pages);
  const content = safeStringify(jsonData.metadata.heading);
  return (
    <main>
      <EntryListLayout 
        title={siteConfig.siteName} 
        content={content} 
        list={entries} />
      <footer>This is an experimental Next.js application.</footer>
    </main>
  );
}
