import Entry from '@/data/interfaces/entry'
import EntryQueryParams from '@/data/interfaces/queryFilter'

export default interface EntryProvider {
    // TODO: Update to a paged interface.
    getAllEntries(): Promise<Entry[]>

    // Query for a subset of data entries.
    queryEntries(filter: EntryQueryParams): Promise<Entry[]>
}
