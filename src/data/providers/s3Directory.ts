import DataProvider from '@/data/interfaces/dataProvider';
import FileTransformer from '@/data/interfaces/fileTransformer';
import Entry from '@/data/interfaces/entry';

// A DataProvider to scan an S3 bucket and generate Entries from the results.
// The idea is to find a way to disconnect the actual content
// from the site source code so they aren't in the same repo.
export default class S3BucketDataProvider implements DataProvider {
    private transformer: FileTransformer;

    constructor(transformer: FileTransformer) {
        this.transformer = transformer;
    }

    async query(): Promise<void> {}

    async getEntries(): Promise<Entry[]> {
        // TODO: read data from an S3 bucket
        return []
    }
}
