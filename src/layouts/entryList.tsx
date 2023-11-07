import Entry from '@/data/interfaces/entry'
import { contentToHTML } from '@/data/interfaces/types'

export default function EntryListLayout({ content, list }: { content: string, list: Entry[] } ) {
    return (
        <>
            <header><p>{content}</p></header>
            {list.map((entry) => {
                const htmlContent = entry.article != null 
                    ? contentToHTML(entry.article) : contentToHTML(entry.summary)
                return (
                    <section key={entry.timestamp}>
                        <article>
                            <header>
                                <h1>{entry.title}</h1>
                                <h2>{new Date(entry.timestamp).toString()}</h2>
                            </header>
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                            <footer>
                                <p>Footer</p>
                            </footer>
                        </article>
                    </section>
                )
            })}
        </>
    )
}