import EntryListLayout from '@/layouts/entryList'
import LocalDirectoryDataProvider from '@/data/providers/localDirectory'
import MarkdownTransformer from '@/data/transformers/markdownTransformer'

export const generateStaticParams = async () => {
  return [{source: "blog"}]
}

/* List of most recent entries in the category */
/* All you have to do is add "async" to the function declaration ugh */
export default async function Page({ params }: { params: { source: string } }) {
    const content = 'List of the most recent content from the source "' + params.source + '". Sources can be things like blog posts from different categories (gaming, music, reviews, etc.) or a data sources such as a movie or book database. There might be filters and search.'
    const transformer = new MarkdownTransformer()
    const entryProvider = new LocalDirectoryDataProvider('content/' + params.source, transformer)
    const entries = await entryProvider.getEntries()

    return (
      <main>
          <EntryListLayout 
            content={content}
            list={entries} />
      </main>
    )
}
