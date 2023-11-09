import EntryListLayout from '@/layouts/entryList'
import { generateRouteDictionary } from '@/site/generateRoutes'
import { generateLatestEntries } from '@/site/generateLatestEntries'

export default async function Home() {
  // I only want this function to run exactly once
  // at build time on the server:
  generateRouteDictionary()

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
