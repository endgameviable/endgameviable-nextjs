import EntryProvider from "@/data/interfaces/entryProvider"
import MarkdownFileDecoder from "@/data/transformers/markdownDecoder"
import MovieDecoder from "@/data/transformers/movieDecoder"
import ContentDirectoryProvider from "../src/data/providers/localDirectory"
import { ContentProvider } from "@/data/interfaces/contentProvider"
import LocalDirectoryProvider from "@/data/readers/localDirectoryProvider"
import { MarkdownFileReader } from "@/data/readers/markdownFileReader"
import { MovieDataReader } from "@/data/readers/movieDataReader"

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
    provider1: EntryProvider
    provider2: ContentProvider
}

type sections = {
    [key: string]: sectionInfo
}

export const SITE_SECTIONS: sections = {
    blog: {
        name: "blog",
        provider2: new LocalDirectoryProvider(
            "blog", ".md", ["movies"], new MarkdownFileReader()
        ),
        provider1: new ContentDirectoryProvider(
            "blog", 
            ".md",
            ["movies"], // exclude
            new MarkdownFileDecoder())
    },
    movies: {
        name: "movies",
        provider2: new LocalDirectoryProvider(
            "movies", ".yaml", [], new MovieDataReader()
        ),
        provider1: new ContentDirectoryProvider(
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