import Link from 'next/link';
import Image from 'next/image';
import PageContent, { renderArticleAsHTML } from '@/data/interfaces/content';
import EntryDateTime from './dateTime';
import MastodonThreadLayout from '../client/mastodonThread';
import { canonicalizePath } from '@/site/utilities';
import { safeStringify } from '@/types/strings';
import CommentBoxLayout from '../client/commentBox';

export default function ContentArticle({ entry }: { entry: PageContent }) {
    const htmlContent = renderArticleAsHTML(entry);
    const url = canonicalizePath(entry.route);
    let image: JSX.Element = <></>;
    if (entry.image) {
        image = (
            <Image
                src={entry.image}
                alt="{entry.title}"
                width={1024}
                height={1024}
            />
        );
    }

    let commentBoxComponent = <></>;
    if (process.env.EGV_USER_COMMENTBOX_APPID)
        commentBoxComponent = <CommentBoxLayout />;

    return (
        <>
            <article>
                <header>
                    <h1>
                        <Link href={entry.route.replace(/\/index\.json$/, '')}>
                            {entry.title}
                        </Link>
                    </h1>
                    <p>
                        <EntryDateTime timestamp={entry.timestamp} />
                    </p>
                    <p>{safeStringify(entry.summary)}</p>
                    {image}
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer></footer>
            </article>
            <section>
                <MastodonThreadLayout route={url} />
            </section>
            {commentBoxComponent}
        </>
    );
}
