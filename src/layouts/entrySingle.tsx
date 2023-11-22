import Link from 'next/link';
import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from '@/data/interfaces/entry';
import MastodonThreadLayout from './mastodonThread';
import { canonicalizeUrl } from '@/site/utilities';

export default function SingleEntryLayout({ entry, summary }: { entry: Entry, summary: boolean }) {
  let htmlContent: string;
  let thread: JSX.Element;
  if (summary) {
    htmlContent = renderSummaryAsHTML(entry);
    thread = <></>;
  } else {
    htmlContent = renderArticleAsHTML(entry);
    const url = canonicalizeUrl(entry.route);
    thread = <MastodonThreadLayout route={url} />;
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
        {thread}
      </section>
    </>
  );
}
