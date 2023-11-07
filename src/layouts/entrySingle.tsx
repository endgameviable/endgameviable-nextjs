import Entry from '@/data/interfaces/entry'
import { contentToHTML } from '@/data/interfaces/types'

export default function SingleEntryLayout( { entry }: { entry: Entry } ) {
    const htmlContent = entry.article != null 
        ? contentToHTML(entry.article) : contentToHTML(entry.summary)
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