import { PageContent } from '@/data/interfaces/content';
import EntryQueryParams from '@/data/interfaces/queryFilter';
import { searchEntriesDynamo } from '@/data/dynamo/searchDynamo';
//import { searchEntriesLocal } from '@/data/local/searchLocal';

export async function searchEntries(
    params: EntryQueryParams,
): Promise<PageContent[]> {
    return searchEntriesDynamo(params);
}
