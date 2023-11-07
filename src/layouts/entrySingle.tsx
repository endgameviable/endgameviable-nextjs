import Entry from '@/data/interfaces/entry'
import { contentToHTML } from '@/data/interfaces/types'

export default function SingleEntryLayout( { entry }: { entry: Entry } ) {
    const htmlContent = entry.content != null 
        ? contentToHTML(entry.content) : contentToHTML(entry.summary)
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