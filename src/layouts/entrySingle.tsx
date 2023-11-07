import Entry from '@/data/interfaces/entry'

export default function SingleEntryLayout( { entry }: { entry: Entry } ) {
    const htmlContent = entry.content != null 
        ? entry.content.toHTML() : entry.summary.toHTML()
    return (
        <>
            <section>
                <article>
                <header><h1>{entry.title}</h1><h2>{entry.date.toISOString()}</h2></header>
                <p>{htmlContent}</p>
                <footer><p>Metadata</p></footer>
                </article>
            </section>
        </>
    )
}