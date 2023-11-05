import FileInfo from '@/data/interfaces/fileInfo';
import FileTransformer from '@/data/interfaces/fileTransformer'
import Entry from '@/data/interfaces/entry'

// Transform a Markdown post file to a view model
export default class MarkdownTransformer implements FileTransformer {

    async transform(file: FileInfo): Promise<Entry[]> {
        return [{
            key: file.path,
            date: file.stats.mtime.toISOString(),
            title: file.path,
            content: await file.getContent()
          }];
    }

}
