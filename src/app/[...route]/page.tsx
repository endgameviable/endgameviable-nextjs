import SingleEntryLayout from '@/layouts/entrySingle'
import { PAGE_SIZE, getSectionInfo } from '@config/site-config'
import EntryListLayout from '@/layouts/entryList'
import { getFullRoute } from '@/data/interfaces/contentRoute'

// Renders either a single entry page or a list
export default async function Page({ params }: { params: { route: string[] } }) {
  const source = params.route[0]
  const route = params.route.join('/')
  const sectionInfo = getSectionInfo(source)
  const startTime = performance.now()
  var component: JSX.Element
  if (params.route.length === 1) {
    const entries = await sectionInfo.provider2.getAllEntries()
    entries.sort((b, a) => a.timestamp - b.timestamp)
    component = <EntryListLayout
      content="List"
      list={entries.slice(0, PAGE_SIZE)} />
  } else {
    const allRoutes = await sectionInfo.provider2.getAllRoutes()
    const match = allRoutes.find((e) => getFullRoute(e) === route)
    if (match !== undefined) {
      const entry = await sectionInfo.provider2.getEntry(params.route.join("/"))
      component = <SingleEntryLayout entry={entry} />
    } else {
      const entries = await sectionInfo.provider2.getEntries({
        routeStartsWith: route,
        contains: ""
      })
      entries.sort((b, a) => a.timestamp - b.timestamp)
      component = <EntryListLayout
        content="Sub-directory List"
        list={entries.slice(0, PAGE_SIZE)} />
    }
  }
  const elapsed = performance.now() - startTime
  console.log(`genereated page in ${elapsed.toFixed(2)}ms`)
  return (
    <main>
      <p>Content source: {source}</p>
      {component}
    </main>
  )
}
