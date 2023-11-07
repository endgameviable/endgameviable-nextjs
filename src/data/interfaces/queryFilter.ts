import Entry from "./entry"
import { safeTextSearch } from "@/typeConversion"

export default interface EntryQueryParams {
    source: string
    contains: string
}

export const MATCH_ALL: EntryQueryParams = {
    source: "",
    contains: ""
}

// Check to see if an entry passes the filter parameters
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
