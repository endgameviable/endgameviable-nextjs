import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from '@/data/interfaces/entry';
import Link from 'next/link';

export default function SingleEntryLayout({ entry, summary }: { entry: Entry, summary: boolean }) {
  let htmlContent = renderArticleAsHTML(entry);
  if (summary) {
    htmlContent = renderSummaryAsHTML(entry);
  }
  return (
    <>
      <section>
        <article>
          <header>
            <h1><Link href={entry.route.replace(/\/index\.json$/, '')}>{entry.title}</Link></h1>
            <h2>{new Date(entry.timestamp).toString()}</h2>
          </header>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <footer>
          </footer>
        </article>
      </section>
    </>
  );
}
