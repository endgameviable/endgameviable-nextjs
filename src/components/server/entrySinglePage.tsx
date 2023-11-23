import Link from 'next/link';
import Entry, { renderArticleAsHTML, renderSummaryAsHTML } from '@/data/interfaces/entry';
import MastodonThreadLayout from '../client/mastodonThread';
import { canonicalizeUrl } from '@/site/utilities';

export default function SingleEntryPage({ entry }: { entry: Entry }) {
  let htmlContent: string;
  htmlContent = renderArticleAsHTML(entry);
  const url = canonicalizeUrl(entry.route);
  return (
    <>
      <article>
        <header>
          <h1><Link href={entry.route.replace(/\/index\.json$/, '')}>{entry.title}</Link></h1>
          <p><time dateTime={new Date(entry.timestamp).toISOString()}>{new Date(entry.timestamp).toString()}</time></p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <footer>
        </footer>
      </article>
      <section>
        <MastodonThreadLayout route={url} />
      </section>
    </>
  );
}
