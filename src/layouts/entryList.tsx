import Entry, { renderArticleAsHTML } from '@/data/interfaces/entry';

export default function EntryListLayout({
  content,
  list,
}: {
  content: string;
  list: Entry[];
}) {
  return (
    <>
      <header>
        <p>{content}</p>
      </header>
      {list.map((entry) => {
        const htmlContent = renderArticleAsHTML(entry);
        return (
          <section key={entry.timestamp + entry.route}>
            <article>
              <header>
                <h1>{entry.title}</h1>
                <h2>{new Date(entry.timestamp).toString()}</h2>
                <h3>{entry.route}</h3>
              </header>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              <footer />
            </article>
          </section>
        );
      })}
    </>
  );
}
