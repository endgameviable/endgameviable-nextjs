import Entry from '@/data/interfaces/entry'

export default function SingleEntryLayout( { entry }: { entry: Entry } ) {
    return (
        <>
            <section>
                <article>
                <header><h1>{entry.title}</h1><h2>{entry.date.toISOString()}</h2></header>
                <p>{entry.content}</p>
                <footer><p>Metadata</p></footer>
                </article>
            </section>
        </>
    )
}