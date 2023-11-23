import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry';
import { canonicalizeUrl } from '@/site/utilities';
import Link from 'next/link';

export default function MicroPostEntryLayout({ entry }: { entry: Entry }) {
  const htmlContent = renderArticleAsHTML(entry);
  return (
    <>
      <article>
        <header>
          <p><Link href={canonicalizeUrl(entry.route)}><time dateTime={new Date(entry.timestamp).toISOString()}>{new Date(entry.timestamp).toString()}</time></Link></p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <footer>
        </footer>
      </article>
    </>
  );
}
