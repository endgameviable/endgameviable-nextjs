import Image from 'next/image'
import EntryModel from '@/models/entry'
import EntryListLayout from '@/layouts/entryList'

export default function Home() {
  const list : EntryModel[] = [
    {
      key: "1",
      date: "2023-01-01 15:00:00",
      title: "Entry the First",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      key: "2",
      date: "2023-01-02 16:00:00",
      title: "Entry the Second",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ]
  const content = 'The site home page.'
  
  return (
    <main>
        <EntryListLayout 
          content={content}
          list={list} />
    </main>
)
}
