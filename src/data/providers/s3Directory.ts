import EntryProvider from '@/data/interfaces/entryProvider';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry from '@/data/interfaces/entry';
import EntryQueryParams from '@/data/interfaces/queryFilter';

// A DataProvider to scan an S3 bucket and generate Entries from the results.
// The idea is to find a way to disconnect the actual content
// from the site source code so they aren't in the same repo.
export default class S3BucketProvider implements EntryProvider {
    private transformer: FileDecoder;

    constructor(transformer: FileDecoder) {
        this.transformer = transformer;
    }

    async query(): Promise<void> {}

    async getAllEntries(): Promise<Entry[]> {
        // TODO: read data from an S3 bucket
        return []
    }

    async queryEntries(filter: EntryQueryParams): Promise<Entry[]> {
        return []
    }
}
