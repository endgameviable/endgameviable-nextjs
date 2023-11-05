import * as yaml from 'js-yaml';

import FileInfo from '@/data/interfaces/fileInfo';
import FileTransformer from '@/data/interfaces/fileTransformer'
import Entry from '@/data/interfaces/entry'

// Parse movie entries from a single YAML file into view models
export default class MovieTransformer implements FileTransformer {

    async transform(file: FileInfo): Promise<Entry[]> {
        const data: any = yaml.load(file.content)
        const entries: Entry[] = []
        if (Array.isArray(data.movies)) {
            let index = 0
            for (const movie of data.movies) {
                const entry = {
                    key: index.toString(),
                    date: movie.last_seen,
                    title: movie.title,
                    content: movie.review
                }
                entries.push(entry)
                index++
            }
        }
        return entries
    }

}
