import EntryProvider from "@/data/interfaces/entryProvider"
import FileDecoder from "@/data/interfaces/fileDecoder"
import MarkdownFileDecoder from "@/data/transformers/markdownDecoder"
import MovieDecoder from "@/data/transformers/movieDecoder"
import ContentDirectoryProvider from "./data/providers/contentDirectory"

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
        provider: new ContentDirectoryProvider("blog", 
            new MarkdownFileDecoder())
    },
    movies: {
        name: "movies",
        provider: new ContentDirectoryProvider("movies",
            new MovieDecoder())
    }
}

export function getSectionInfo(name: string): sectionInfo {
    return SITE_SECTIONS[name]
}
