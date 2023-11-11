import { MATCH_ALL_ENTRIES } from '@/data/interfaces/queryFilter'
import EntryListLayout from '@/layouts/entryList'
import { PAGE_SIZE, SITE_SECTIONS, getSectionInfo } from '@config/siteConfig'

export const generateStaticParams = async () => {
  const params = []
  for (const key in SITE_SECTIONS) {
    params.push({source: key})
  }
  return params
}

/* Static landing page for this category, showing the most recent entries */
/* Note to self: Ugh all you have to do is add "async" to the function declaration */
export default async function Page({ params }: { params: { source: string } }) {
    const startTime = performance.now()
    const sectionInfo = getSectionInfo(params.source)
    const content = 'List of the most recent content from the source "' + params.source + '". Sources can be things like blog posts from different categories (gaming, music, reviews, etc.) or a data sources such as a movie or book database. There might be filters and search.'

    // Get all available entries
    const entries = await sectionInfo.provider2.getAllEntries()

    // Sort by date descending
    entries.sort((b, a) => a.timestamp - b.timestamp)

    const elapsed = (performance.now() - startTime).toFixed(2)
    console.log(`${params.source} page generated in: ${elapsed}ms`)

    return (
      <main>
          <EntryListLayout 
            content={content}
            list={entries.slice(0, PAGE_SIZE)} />
      </main>
    )
}
