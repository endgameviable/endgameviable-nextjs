import Link from 'next/link';
import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry';
import EntryDateTime from './dateTime';
import { canonicalizePath } from '@/site/utilities';

export default function MicroPostEntryLayout({ entry }: { entry: Entry }) {
  const htmlContent = renderArticleAsHTML(entry);
  return (
    <>
      <article>
        <header>
          <p><Link href={canonicalizePath(entry.route)}>
            <EntryDateTime timestamp={entry.timestamp} />
          </Link></p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <footer>
        </footer>
      </article>
    </>
  );
}
