import * as path from 'path'
import { promises as fs } from 'fs'
import { Stats } from 'fs'
import { ContentFile, getBaseName } from '@/data/interfaces/contentFile'

export class LocalFileRoute implements ContentFile {
    public path: string
    public name: string
    public rootPath: string
    public pathname: string
    public stats: Stats

    constructor(rootPath: string, relativePath: string, filename: string, stats: Stats) {
        this.rootPath = rootPath
        this.path = relativePath
        this.name = getBaseName(filename)
        this.pathname = path.join(rootPath, relativePath, filename)
        this.stats = stats
    }

    public async readContent(): Promise<string> {
        try {
            return await fs.readFile(this.pathname, 'utf8');
        } catch (error) {
            console.log("error loading file:", error)
            return ""
        }
    }
}

// Information about a single local file
// TODO: This needs to be updated so it's
// less specific to a local filesystem.
// ie. it should be an interface with
// an implementation for the local filesystem and for S3.
// TODO: Replace
// export default class FileInfo {
//     public rootPath: string
//     public pathname: string
//     public filename: string
//     public stats: Stats

//     constructor(rootPath: string, path: string, filename: string, stats: Stats) {
//         this.rootPath = rootPath
//         this.pathname = path
//         this.filename = filename
//         this.stats = stats
//     }

//     // Thanks ChatGPT
//     public getBaseName(): string {
//         const lastIndex = this.filename.lastIndexOf(".")
//         if (lastIndex === -1) {
//             // If there's no dot (.), return the entire filename.
//             return this.filename
//         }
//         // Extract the part of the filename before the last dot.
//         return this.filename.substring(0, lastIndex);
//     }

//     public getFullPath(): string {
//         return path.join(this.rootPath, this.pathname, this.filename)
//     }

//     public async getContent(): Promise<string> {
//         try {
//             return await fs.readFile(this.getFullPath(), 'utf8');
//         } catch (error) {
//             console.log("error loading file:", error)
//             return ""
//         }
//     }
// }
