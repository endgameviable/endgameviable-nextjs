import { getSectionInfo } from "@/site-config"

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
            entries = entries.filter((entry) =>
                entry.title?.includes(textFilter)
                || entry.summary.text.includes(textFilter)
                || entry.content?.text.includes(textFilter)
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