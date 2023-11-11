import path from 'path'
import EntryProvider from "@/data/interfaces/entryProvider"
import MarkdownFileDecoder from "@/data/transformers/markdownDecoder"
import MovieDecoder from "@/data/transformers/movieDecoder"
import ContentDirectoryProvider from "../src/data/providers/localDirectory"
import { ContentProvider } from "@/data/interfaces/contentProvider"
import LocalDirectoryProvider from "@/data/readers/localDirectoryProvider"
import { MarkdownFileReader } from "@/data/readers/markdownFileReader"
import { MovieDataReader } from "@/data/readers/yaml/movieDataReader"
import { EldenRingDataReader } from "@/data/readers/yaml/eldenRingDataReader"
import { syncHugoContentDir } from './gitSync'

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
    //provider1: EntryProvider
    provider2: ContentProvider
}

type sections = {
    [key: string]: sectionInfo
}

async function noInitializer(): Promise<void> {
    // Resolves immediately
    return Promise.resolve<void>(undefined)
}

export const SITE_SECTIONS: sections = {
    content: {
        name: "content",
        provider2: new LocalDirectoryProvider(
            path.join(process.cwd(), 'content-remote/endgameviable-hugo'),
            "content", ".md", ["movies"], 
            new MarkdownFileReader(),
            syncHugoContentDir
        ),
        // provider1: new ContentDirectoryProvider(
        //     "blog", 
        //     ".md",
        //     ["movies"], // exclude
        //     new MarkdownFileDecoder())
    },
    movies: {
        name: "movies",
        provider2: new LocalDirectoryProvider(
            path.join(process.cwd(), 'content'),
            "movies", ".yaml", [], 
            new MovieDataReader(),
            noInitializer),
        // provider1: new ContentDirectoryProvider(
        //     "movies",
        //     ".yaml",
        //     [],
        //     new MovieDecoder("movies"))
    },
    eldenring: {
        name: "eldenring",
        provider2: new LocalDirectoryProvider(
            path.join(process.cwd(), 'content'),
            "eldenring", ".yaml", [], 
            new EldenRingDataReader(),
            noInitializer),
        // provider1: new ContentDirectoryProvider(
        //     "eldenring",
        //     ".yaml",
        //     [],
        //     new MovieDecoder("eldenring"))
    }
}

export function getSectionInfo(name: string): sectionInfo {
    return SITE_SECTIONS[name]
}

export function getSections(): sectionInfo[] {
    return Object.values(SITE_SECTIONS)
}