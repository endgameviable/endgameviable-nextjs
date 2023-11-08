import * as yaml from 'js-yaml';

import FileInfo from '@/data/interfaces/fileInfo';
import FileDecoder from '@/data/interfaces/fileDecoder'
import Entry from '@/data/interfaces/entry'
import { TextType } from '@/data/interfaces/types';
import { safeParseDate, safeParseDateMillis } from '@/typeConversion';

// Parse movie entries from a single YAML file into view models
export default class MovieDecoder implements FileDecoder {
    private route: string

    constructor(route: string) {
        this.route = route
    }

    async decode(file: FileInfo): Promise<Entry[]> {
        const data: any = yaml.load(await file.getContent())
        const entries: Entry[] = []
        if (Array.isArray(data.movies)) {
            let index = 0
            for (const movie of data.movies) {
                const localDate = safeParseDate(movie.last_seen)
                const entry: Entry = {
                    route: this.route,
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
