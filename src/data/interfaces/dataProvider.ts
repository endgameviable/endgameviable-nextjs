import EntryModel from '@/models/entry'

export default interface DataProvider {
    getEntries(): Promise<EntryModel[]>
}
