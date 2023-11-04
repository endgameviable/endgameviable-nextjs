import EntryModel from '@/models/entry'
import SingleEntryLayout from '@/layouts/entrySingle'

/* Single page display the content slug */
export default function Page({ params }: { params: { source: string, id: string } }) {
    const content = 'Content for the item with the unique slug "' + params.id + '". From the database source "' + params.source + '".'
    const entry : EntryModel = {
      key: '1',
      date: '2023-11-03 23:20:00',
      title: 'A single post',
      content: content
    }
    return (
      <main>
        <SingleEntryLayout entry={entry} />
      </main>
    )
}
