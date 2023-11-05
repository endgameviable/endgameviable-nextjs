import Entry from '@/data/interfaces/entry'

export default interface DataProvider {
    getEntries(): Promise<Entry[]>
}
