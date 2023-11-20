import Entry from '@/data/interfaces/entry';
import SingleEntryLayout from './entrySingle';
import MicroPostEntryLayout from './entryMicropost';

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
        <h1>List Page</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </header>
      {list.map((entry) => {
        if (entry.type === "micropost") {
          return (
            <MicroPostEntryLayout key={entry.route} entry={entry} />
          )
        }
        else {
          return (
            <SingleEntryLayout key={entry.route} entry={entry} />
          )
        }
      })}
    </>
  );
}
