import Entry from '@/data/interfaces/entry'

export default interface DataProvider {
    query(): Promise<void>
    getEntries(): Promise<Entry[]>
}
