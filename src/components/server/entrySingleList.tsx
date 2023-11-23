import Link from 'next/link';
import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from '@/data/interfaces/entry';
import EntryDateTime from './dateTime';

export default function SingleEntryList({ entry, summary }: { entry: Entry, summary: boolean }) {
  let htmlContent: string;
  let thread: JSX.Element;
  if (summary) {
    htmlContent = renderSummaryAsHTML(entry);
  } else {
    htmlContent = renderArticleAsHTML(entry);
  }
  return (
    <>
      <article>
        <header>
          <h2><Link href={entry.route.replace(/\/index\.json$/, '')}>{entry.title}</Link></h2>
          <p><EntryDateTime timestamp={entry.timestamp} /></p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <footer>
        </footer>
      </article>
    </>
  );
}
