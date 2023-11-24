import Entry from "@/data/interfaces/entry";
import EntryQueryParams from "@/data/interfaces/queryFilter";
import { searchEntriesDynamo } from "@/data/dynamo/searchDynamo";

export async function searchEntries(params: EntryQueryParams): Promise<Entry[]> {
    return searchEntriesDynamo(params);
}
