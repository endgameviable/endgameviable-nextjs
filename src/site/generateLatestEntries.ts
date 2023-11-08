import Entry from "@/data/interfaces/entry"
import { MATCH_ALL_ENTRIES } from "@/data/interfaces/queryFilter"
import { PAGE_SIZE, getSections } from "@/site-config"

export async function generateLatestEntries(): Promise<Entry[]> {
    const entries: Entry[] = []
    for (const section of getSections()) {
        entries.push(...await section.provider.queryEntries(MATCH_ALL_ENTRIES))
    }
    entries.sort((b, a) => a.timestamp - b.timestamp)
    return entries.slice(0, PAGE_SIZE)
}  