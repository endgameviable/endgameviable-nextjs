import Entry from '@/data/interfaces/entry';
import SingleEntryList from './entrySingleList';
import MicroPostEntryLayout from './entryMicropost';

export default function EntryListLayout({
  title,
  content,
  list,
}: {
  title: string;
  content: string;
  list: Entry[];
}) {
  return (
    <>
      <header>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </header>
      <section>
      {list.map((entry) => {
        if (entry.type === "micropost") {
          return (
            <MicroPostEntryLayout key={entry.route} entry={entry} />
          )
        }
        else {
          return (
            <SingleEntryList key={entry.route} entry={entry} summary={true} />
          )
        }
      })}
      </section>
      <footer>
      </footer>
    </>
  );
}
