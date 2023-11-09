import * as path from 'path';
import * as yaml from 'js-yaml';
import { FileDataSource } from "../interfaces/fileDataSource"
import Entry from "../interfaces/entry"
import { ContentFile } from '../interfaces/contentFile';
import { safeParseDateMillis, safeStringify } from '@/typeConversion';
import { TextType } from '../interfaces/types';

export class MovieFileDataSource implements FileDataSource {
    private contentFile: ContentFile

    constructor(contentFile: ContentFile) {
      this.contentFile = contentFile
    }

    public async getRoutes(): Promise<string[]> {
        const data: any = yaml.load(await this.contentFile.readContent())
        const routes: string[] = []
        if (Array.isArray(data.movies)) {
            for (const movie of data.movies) {
                routes.push(
                    path.join(safeStringify(movie.year), 
                        safeStringify(movie.title))
                )
            }
        }
        return routes
    }
  
    public async getEntries(): Promise<Entry[]> {
        const data: any = yaml.load(await this.contentFile.readContent())
        const entries: Entry[] = []
        if (Array.isArray(data.movies)) {
            let index = 0
            for (const movie of data.movies) {
                const entry: Entry = {
                    route: path.join(this.contentFile.path, safeStringify(movie.year), safeStringify(movie.title)),
                    timestamp: safeParseDateMillis(movie.last_seen),
                    title: movie.title,
                    article: new TextType(movie.review, "text/markdown")
                }
                entries.push(entry)
                index++
            }
        }
        return entries
    }
  }
  