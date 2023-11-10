import EntryListLayout from '@/layouts/entryList'
import { generateRouteDictionary } from '@/site/generateRoutes'
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
