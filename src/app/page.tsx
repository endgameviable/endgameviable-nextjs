import EntryListLayout from '@/components/server/entryList';
import { siteConfig } from '@config/siteConfig';
import { contentToHTML } from '@/types/contentText';
import { getContentAtRoute } from '@/site/getContent';

export default async function Home() {
  const entry = await getContentAtRoute([]);
  const content = contentToHTML(entry.article);
  const entries = entry.children ? entry.children : [];
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
