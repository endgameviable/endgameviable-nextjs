import { ContentRoute } from './contentRoute'
import Entry from './entry'
import EntryQueryParams from './queryFilter'

// New and improved content provider that's more route-aware
export interface ContentProvider {
    getAllRoutes(): Promise<ContentRoute[]>
    getAllPaths(): string[]
    getAllEntries(): Promise<Entry[]>
    getEntries(filter: EntryQueryParams): Promise<Entry[]>
    getEntry(route: string): Promise<Entry>
}
