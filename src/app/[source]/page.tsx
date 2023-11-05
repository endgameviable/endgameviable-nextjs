import EntryListLayout from '@/layouts/entryList'
import LocalDirectoryDataProvider from '@/data/providers/localDirectory'
import MarkdownTransformer from '@/data/transformers/markdownTransformer'
import { PAGE_SIZE, SITE_SECTIONS, getSectionInfo } from '@/site-config'

export const generateStaticParams = async () => {
  const params = []
  for (const key in SITE_SECTIONS) {
    params.push({source: key})
  }
  return params
}

/* List of most recent entries in the category */
/* All you have to do is add "async" to the function declaration ugh */
export default async function Page({ params }: { params: { source: string } }) {
    const sectionInfo = getSectionInfo(params.source)
    const content = 'List of the most recent content from the source "' + params.source + '". Sources can be things like blog posts from different categories (gaming, music, reviews, etc.) or a data sources such as a movie or book database. There might be filters and search.'

    const entryProvider = new LocalDirectoryDataProvider('content/' + params.source, sectionInfo.contentTransformer)
    await entryProvider.query()
    const entries = await entryProvider.getEntries()

    return (
      <main>
          <EntryListLayout 
            content={content}
            list={entries.slice(0, PAGE_SIZE-1)} />
      </main>
    )
}
