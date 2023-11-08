import EntryProvider from '@/data/interfaces/entryProvider';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry, { ERROR_ENTRY } from '@/data/interfaces/entry';
import EntryQueryParams, { MATCH_ALL_ENTRIES } from '@/data/interfaces/queryFilter';

// A DataProvider to scan an S3 bucket and generate Entries from the results.
// The idea is to find a way to disconnect the actual content
// from the site source code so they aren't in the same repo.
export default class S3BucketProvider implements EntryProvider {
    private transformer: FileDecoder;

    constructor(transformer: FileDecoder) {
        this.transformer = transformer;
    }

    async getEntry(): Promise<Entry> {
        return ERROR_ENTRY
    }

    async getAllEntries(): Promise<Entry[]> {
        return this.queryEntries(MATCH_ALL_ENTRIES)
    }

    async queryEntries(filter: EntryQueryParams): Promise<Entry[]> {
        return []
    }
}
