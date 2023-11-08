import { TextType, contentToHTML } from "./types"

// A single displayable content entry.
// Presumably one of a list of entries,
// which can be sorted by date.
// TODO: add basic string metadata key/value pairs
export default interface Entry {
    timestamp: number
    summary?: TextType
    article: TextType
    title?: string
}

export function renderSummaryAsHTML(entry: Entry): string {
    if (entry.summary !== null && entry.summary !== undefined)
        return contentToHTML(entry.summary)
    else
        return "no summary"
}

export function renderArticleAsHTML(entry: Entry): string {
    if (entry.article !== null && entry.article !== undefined)
        return contentToHTML(entry.article)
    else if (entry.summary !== null && entry.summary !== undefined)
        return contentToHTML(entry.summary)
    else
        return "no article"
}