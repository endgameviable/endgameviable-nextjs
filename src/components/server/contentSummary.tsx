import Link from 'next/link';
import PageContent, {
    renderArticleAsHTML,
    renderSummaryAsHTML,
} from '@/data/interfaces/content';
import EntryDateTime from './dateTime';

export default function ContentSummary({
    entry,
    summary,
}: {
    entry: PageContent;
    summary: boolean;
}) {
    let htmlContent: string;
    if (summary) {
        htmlContent = renderSummaryAsHTML(entry);
    } else {
        htmlContent = renderArticleAsHTML(entry);
    }
    return (
        <>
            <article>
                <header>
                    <h2>
                        <Link href={entry.route.replace(/\/index\.json$/, '')}>
                            {entry.title}
                        </Link>
                    </h2>
                    <p>
                        <EntryDateTime timestamp={entry.timestamp} />
                    </p>
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer></footer>
            </article>
        </>
    );
}
