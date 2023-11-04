import EntryModel from '@/models/entry'

export default function SingleEntryLayout( { entry }: { entry: EntryModel } ) {
    return (
        <>
            <section>
                <article>
                <header><h1>{entry.title}</h1><h2>{entry.date}</h2></header>
                <p>{entry.content}</p>
                <footer><p>Metadata</p></footer>
                </article>
            </section>
        </>
    )
}