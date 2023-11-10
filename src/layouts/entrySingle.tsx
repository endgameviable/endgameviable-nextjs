import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry'

export default function SingleEntryLayout( { entry }: { entry: Entry } ) {
    const htmlContent = renderArticleAsHTML(entry)
    return (
        <>
            <section>
                <article>
                <header>
                    <h1>{entry.title}</h1>
                    <h2>{new Date(entry.timestamp).toString()}</h2>
                    <h3>{entry.route}</h3>
                </header>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <footer><p>Metadata</p></footer>
                </article>
            </section>
        </>
    )
}