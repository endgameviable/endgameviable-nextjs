import EntryProvider from "@/data/interfaces/entryProvider"
import MarkdownFileDecoder from "@/data/transformers/markdownDecoder"
import MovieDecoder from "@/data/transformers/movieDecoder"
import ContentDirectoryProvider from "../src/data/providers/localDirectory"

type metaData = {
    [key: string]: string
}

export const siteConfig: metaData = {
    siteName: "Endgame Viable Next.js Beta",
    siteUrl: "https://beta.endgameviable.com",
}

export const PAGE_SIZE: number = 10

interface sectionInfo {
    name: string
    provider: EntryProvider
}

type sections = {
    [key: string]: sectionInfo
}

export const SITE_SECTIONS: sections = {
    blog: {
        name: "blog",
        provider: new ContentDirectoryProvider(
            "blog", 
            ".md",
            ["movies"], // exclude
            new MarkdownFileDecoder())
    },
    movies: {
        name: "movies",
        provider: new ContentDirectoryProvider(
            "movies",
            ".yaml",
            [],
            new MovieDecoder("movies"))
    }
}

export function getSectionInfo(name: string): sectionInfo {
    return SITE_SECTIONS[name]
}

export function getSections(): sectionInfo[] {
    return Object.values(SITE_SECTIONS)
}