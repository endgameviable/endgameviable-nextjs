import Entry from '@/data/interfaces/entry'
import SingleEntryLayout from '@/layouts/entrySingle'

/* Single page display the content slug */
export default function Page({ params }: { params: { source: string, id: string } }) {
    const content = 'Content for the item with the unique slug "' + params.id + '". From the database source "' + params.source + '".'
    const entry : Entry = {
      key: '1',
      date: new Date(2023, 11, 3, 23, 20, 0),
      title: 'A single post',
      content: content
    }
    return (
      <main>
        <SingleEntryLayout entry={entry} />
      </main>
    )
}
