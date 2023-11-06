import Entry from '@/data/interfaces/entry'

export default interface EntryProvider {
    // This feels wasteful.
    // In most cases we only display a subset.
    // Still, there needs to be a way to measure
    // how many there are in total.
    // TODO: Update to a paged interface.
    // Something like, getCount(), getEntries(start,end)
    // And account for ascending and descending sort.
    getAllEntries(): Promise<Entry[]>
}
