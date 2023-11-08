import * as path from 'path'
import { promises as fs } from 'fs'
import { Stats } from 'fs'

// Information about a single local file
// TODO: This needs to be updated so it's
// less specific to a local filesystem.
// ie. it should be an interface with
// an implementation for the local filesystem and for S3.
export default class FileInfo {
    public rootPath: string
    public pathname: string
    public filename: string
    public stats: Stats

    constructor(rootPath: string, path: string, filename: string, stats: Stats) {
        this.rootPath = rootPath
        this.pathname = path
        this.filename = filename
        this.stats = stats
    }

    // Thanks ChatGPT
    public getBaseName(): string {
        const lastIndex = this.filename.lastIndexOf(".")
        if (lastIndex === -1) {
            // If there's no dot (.), return the entire filename.
            return this.filename
        }
        // Extract the part of the filename before the last dot.
        return this.filename.substring(0, lastIndex);
    }

    public getFullPath(): string {
        return path.join(this.rootPath, this.pathname, this.filename)
    }

    public async getContent(): Promise<string> {
        try {
            return await fs.readFile(this.getFullPath(), 'utf8');
        } catch (error) {
            console.log("error loading file:", error)
            return ""
        }
    }
}
