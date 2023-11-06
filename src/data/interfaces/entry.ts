// A single displayable content entry.
// Presumably one of a list of entries,
// which can be sorted by date.
export default interface Entry {
    key: string
    title?: string
    summary?: string
    content: string
    date: Date
    image?: string
    // A function to safely transform the content into HTML for display
    // Typically only needs to be called before display.
    renderContentAsHTML: (content: string) => string
}
