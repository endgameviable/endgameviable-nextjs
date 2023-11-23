import Link from 'next/link';
import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from '@/data/interfaces/entry';
import MastodonThreadLayout from '../client/mastodonThread';
import { canonicalizeUrl } from '@/site/utilities';

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
          <p><time dateTime={new Date(entry.timestamp).toISOString()}>{new Date(entry.timestamp).toString()}</time></p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <footer>
        </footer>
      </article>
    </>
  );
}
