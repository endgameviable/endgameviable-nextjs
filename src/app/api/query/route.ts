import { getSectionInfo } from "@/site-config"

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
    const source = searchParams.get('source')
    const textFilter = searchParams.get('text')
    console.log(`source=${source},text=${textFilter}`)
    if (source != null) {
        const startTime = performance.now()
        const sectionInfo = getSectionInfo(source)

        // Get all available entries
        var entries = await sectionInfo.provider.getAllEntries()

        if (textFilter) {
            entries = entries.filter((entry) => {
                if (searchText(entry.title, textFilter))
                    return true
                if (entry.summary !== null && searchText(entry.summary.text, textFilter))
                    return true
                if (entry.content !== null && searchText(entry.content, textFilter))
                    return true
                return false
            }
          )
        }

        // Sort by date descending
        entries.sort((a, b) => b.date.getTime() - a.date.getTime())

        const elapsed = performance.now() - startTime
        console.log(`${source} entries queried in: ${elapsed}ms`)
        return Response.json({ entries })
    }
    return
}