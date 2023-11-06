import Entry from '@/data/interfaces/entry'

export default function EntryListLayout({ content, list }: { content: string, list: Entry[] } ) {
    return (
        <>
            <header><p>{content}</p></header>
            {list.map((entry) => {
                return (
                    <section key={entry.key}>
                        <article>
                            <header><h1>{entry.title}</h1><h2>{entry.date.toString()}</h2></header>
                            <p>{entry.content}</p>
                            <footer><p>Metadata</p></footer>
                        </article>
                    </section>
                )
            })}
        </>
    )
}