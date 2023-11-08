import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry'

export default function SingleEntryLayout( { entry }: { entry: Entry } ) {
    const htmlContent = renderArticleAsHTML(entry)
    return (
        <>
            <section>
                <article>
                <header><h1>{entry.title}</h1>
                <h2>{entry.timestamp}</h2></header>
                <p>{htmlContent}</p>
                <footer><p>Metadata</p></footer>
                </article>
            </section>
        </>
    )
}