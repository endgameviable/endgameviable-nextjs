import { promises as fs } from 'fs';
import { Stats } from 'fs'

// Information about a single local file
export default class FileInfo {
    public path: string
    public stats: Stats

    constructor(path: string, stats: Stats) {
        this.path = path;
        this.stats = stats;
    }

    public async getContent(): Promise<string> {
        try {
            return await fs.readFile(this.path, 'utf8');
        } catch (error) {
            console.log("error loading file:", error)
            return ""
        }
    }
}
