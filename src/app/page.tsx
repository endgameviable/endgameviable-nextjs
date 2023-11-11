import EntryListLayout from '@/layouts/entryList'
import { generateLatestEntries } from '@/site/generateLatestEntries'
import { BuildTasks } from '@/site/buildTasks'

export default async function Home() {
  // The only way I know how to do this in Next.js:
  // Perform tasks at project build time.
  // This works because the site's index page is
  // statically rendered at build time.
  await BuildTasks()

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
