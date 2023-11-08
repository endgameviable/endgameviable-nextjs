import Entry from "./entry"
import { safeTextSearch } from "@/typeConversion"

// A standard set of filters for querying entries
export default interface EntryQueryParams {
    source: string
    contains: string
}

// A constant to match all entries
export const MATCH_ALL_ENTRIES: EntryQueryParams = {
    source: "",
    contains: ""
}

// Test to see if an entry passes the filter parameters
export function entryMatchesFilter(entry: Entry, filter: EntryQueryParams): boolean {
    if (filter === null) return true
    if (filter.contains !== "") {
        if (safeTextSearch(entry.title, filter.contains)
            || safeTextSearch(entry.summary, filter.contains)
            || safeTextSearch(entry.article, filter.contains))
            return true
        else
            return false
    }
    return true
}
