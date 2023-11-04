import EntryListLayout from '@/layouts/entryList'
import EntryModel from '@/models/entry'

/* List of most recent entries in the category */
export default function Page({ params }: { params: { source: string } }) {
    const list : EntryModel[] = [
      {
        key: "1",
        date: "2023-01-01 15:00:00",
        title: "One",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        key: "2",
        date: "2023-01-02 16:00:00",
        title: "Two",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        key: "3",
        date: "2023-01-03 17:00:00",
        title: "Three",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }
    ]
    const content = 'List of the most recent content from the source "' + params.source + '". Sources can be things like blog posts from different categories (gaming, music, reviews, etc.) or a data sources such as a movie or book database. There might be filters and search.'
    
    return (
      <main>
          <EntryListLayout 
            content={content}
            list={list} />
      </main>
  )
}
