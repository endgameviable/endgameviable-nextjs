import PageContent from "@/data/interfaces/content";
import EntryQueryParams from "@/data/interfaces/queryFilter";
import { searchEntriesDynamo } from "@/data/dynamo/searchDynamo";

export async function searchEntries(params: EntryQueryParams): Promise<PageContent[]> {
    return searchEntriesDynamo(params);
}
