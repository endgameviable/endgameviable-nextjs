import Entry from "@/data/interfaces/entry"
import { PAGE_SIZE, getSectionInfo, getSections } from "@/site-config"

function searchText(s: any, search: string): boolean {
    // Yeesh why is it so hard to deal with strings
    if (s === null)
        return false
    if (s === undefined)
        return false
    const constantS: string = s.toString()
    return constantS.indexOf(search) >= 0
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const textFilter = searchParams.get('text')
    console.log(`querying text=${textFilter}`)

    const startTime = performance.now()
    const allEntries: Entry[] = []

    // Get all available entries from all sections (wasteful; there will be thousands)
    for (const section of getSections()) {
        var entries = await section.provider.getAllEntries()
        allEntries.push(...entries)
    }

    var filteredEntries: Entry[] = allEntries
    if (textFilter) {
        filteredEntries = filteredEntries.filter((entry) => {
            if (searchText(entry.title, textFilter))
                return true
            if (entry.summary !== null && searchText(entry.summary.text, textFilter))
                return true
            if (entry.content !== null && searchText(entry.content, textFilter))
                return true
            return false
        }
        )

        // Sort by date descending
        filteredEntries.sort((a, b) => b.date.getTime() - a.date.getTime())

        const elapsed = performance.now() - startTime
        console.log(`returning ${filteredEntries.length} entries queried in ${elapsed}ms`)
        return Response.json(filteredEntries.slice(0, PAGE_SIZE))
    }
    return
}