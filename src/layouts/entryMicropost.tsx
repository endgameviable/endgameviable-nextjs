import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry';
import Link from 'next/link';

export default function MicroPostEntryLayout({ entry }: { entry: Entry }) {
  const htmlContent = renderArticleAsHTML(entry);
  return (
    <>
      <section>
        <article>
          <header>
            <h2><Link href={entry.route.replace(/\/index\.json$/, '')}>{new Date(entry.timestamp).toString()}</Link></h2>
          </header>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <footer>
          </footer>
        </article>
      </section>
    </>
  );
}
