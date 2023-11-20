import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry';
import Link from 'next/link';

export default function MicroPostEntryLayout({ entry }: { entry: Entry }) {
  const htmlContent = renderArticleAsHTML(entry);
  return (
    <>
      <section>
        <article>
          <header>
            <h2>{new Date(entry.timestamp).toString()}</h2>
            <h3><Link href={entry.route.replace(/\/index\.json$/, '')}>{entry.route}</Link></h3>
          </header>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <footer>
          </footer>
        </article>
      </section>
    </>
  );
}
