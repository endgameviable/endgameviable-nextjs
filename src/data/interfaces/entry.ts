import { TextType } from "./types"

// A single displayable content entry.
// Presumably one of a list of entries,
// which can be sorted by date.
export default interface Entry {
    key: string
    title?: string
    summary: TextType
    content?: TextType
    date: Date
    image?: string
}
