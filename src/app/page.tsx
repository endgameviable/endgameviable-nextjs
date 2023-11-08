import Image from 'next/image'
import Entry from '@/data/interfaces/entry'
import EntryListLayout from '@/layouts/entryList'
import { TextType } from '@/data/interfaces/types'
import { generateLatestEntries } from '@/site/generateLatestEntries'

export default async function Home() {
  const entries = await generateLatestEntries()
  const content = 'The home page with the latest content entries.'
  return (
    <main>
        <EntryListLayout 
          content={content}
          list={entries} />
    </main>
)
}
