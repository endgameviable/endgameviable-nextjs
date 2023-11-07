import Image from 'next/image'
import Entry from '@/data/interfaces/entry'
import EntryListLayout from '@/layouts/entryList'
import { TextType } from '@/data/interfaces/types'

export default async function Home() {
  const list : Entry[] = [
    {
      key: "1",
      date: new Date(2023, 1, 1, 15, 0, 0),
      title: "Entry the First",
      summary: new TextType("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
    },
    {
      key: "2",
      date: new Date(2023, 1, 2, 16, 0, 0),
      title: "Entry the Second",
      summary: new TextType("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
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
