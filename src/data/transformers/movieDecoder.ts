import * as yaml from 'js-yaml';

import FileInfo from '@/data/interfaces/fileInfo';
import FileDecoder from '@/data/interfaces/fileDecoder'
import Entry from '@/data/interfaces/entry'
import { TextType } from '@/data/interfaces/types';

// Parse movie entries from a single YAML file into view models
export default class MovieDecoder implements FileDecoder {

    async decode(file: FileInfo): Promise<Entry[]> {
        const data: any = yaml.load(await file.getContent())
        const entries: Entry[] = []
        if (Array.isArray(data.movies)) {
            let index = 0
            for (const movie of data.movies) {
                const parsedMillis = Date.parse(movie.last_seen)
                const localDate = new Date(parsedMillis)
                const entry: Entry = {
                    key: index.toString(),
                    date: localDate,
                    title: movie.title,
                    summary: new TextType(movie.review, "text/markdown")
                }
                entries.push(entry)
                index++
            }
        }
        return entries
    }

}