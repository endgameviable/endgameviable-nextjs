import Entry from '@/data/interfaces/entry';
import SingleEntryLayout from '@/layouts/entrySingle';
import { TextType } from '@/data/interfaces/types';

/* Single page display the content slug */
export default function Page({
  params,
}: {
  params: { source: string; id: string };
}) {
  const content =
    'Content for the item with the unique slug "' +
    params.id +
    '". From the database source "' +
    params.source +
    '".';
  const entry: Entry = {
    route: `${params.source}/${params.id}`,
    timestamp: new Date(2023, 11, 3, 23, 20, 0).getTime(),
    title: 'A single post',
    article: new TextType(content),
  };
  return (
    <main>
      <SingleEntryLayout entry={entry} />
    </main>
  );
}
