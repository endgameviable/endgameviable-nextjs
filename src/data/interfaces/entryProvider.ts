import Entry from '@/data/interfaces/entry'
import EntryQueryParams from '@/data/interfaces/queryFilter'
import { ContentRoute } from './contentRoute'

export default interface EntryProvider {
    // TODO: Update to paged interfaces.

    // Get the one entry specified by the route
    getEntry(route: ContentRoute): Promise<Entry>

    // Get all entries available
    getAllEntries(): Promise<Entry[]>

    // Query for a subset of entries
    queryEntries(filter: EntryQueryParams): Promise<Entry[]>
}
