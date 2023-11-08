import Image from 'next/image'
import Entry from '@/data/interfaces/entry'
import EntryListLayout from '@/layouts/entryList'
import { TextType } from '@/data/interfaces/types'

export default async function Home() {
  const list : Entry[] = [
    {
      route: "1",
      timestamp: new Date(2023, 1, 1, 15, 0, 0).getTime(),
      title: "Beta Testing A Next.js Blog Platform",
      article: new TextType("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
    },
    {
      route: "2",
      timestamp: new Date(2023, 1, 2, 16, 0, 0).getTime(),
      title: "Entry the Second",
      article: new TextType("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
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
