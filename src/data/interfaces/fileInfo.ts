import * as path from 'path';
import { promises as fs } from 'fs';
import { Stats } from 'fs'

// Information about a single local file
export default class FileInfo {
    public rootPath: string
    public pathname: string
    public filename: string
    public stats: Stats

    constructor(rootPath: string, path: string, filename: string, stats: Stats) {
        this.rootPath = rootPath;
        this.pathname = path;
        this.filename = filename;
        this.stats = stats;
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
