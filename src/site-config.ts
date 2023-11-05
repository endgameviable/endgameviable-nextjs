import FileTransformer from "@/data/interfaces/fileTransformer"
import MarkdownTransformer from "@/data/transformers/markdownTransformer"
import MovieTransformer from "@/data/transformers/movieTransformer"

export const PAGE_SIZE: number = 10

interface sectionInfo {
    name: string
    contentTransformer: FileTransformer
}

type sections = {
    [key: string]: sectionInfo
}

export const SITE_SECTIONS: sections = {
    blog: {
        name: "blog",
        contentTransformer: new MarkdownTransformer()
    },
    movies: {
        name: "movies",
        contentTransformer: new MovieTransformer()
    }
}

export function getSectionInfo(name: string): sectionInfo {
    return SITE_SECTIONS[name]
}
