import Entry from '@/data/interfaces/entry'

export default function EntryListLayout({ content, list }: { content: string, list: Entry[] } ) {
    return (
        <>
            <header><p>{content}</p></header>
            {list.map((entry) => {
                const htmlContent = entry.content != null 
                    ? entry.content.toHTML() : entry.summary.toHTML()
                return (
                    <section key={entry.key}>
                        <article>
                            <header><h1>{entry.title}</h1><h2>{entry.date.toString()}</h2></header>
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                            <footer><p>Metadata</p></footer>
                        </article>
                    </section>
                )
            })}
        </>
    )
}