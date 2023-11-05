import FileInfo from '@/data/interfaces/fileInfo';
import FileTransformer from '@/data/interfaces/fileTransformer'
import EntryModel from '@/models/entry'

export default class MarkdownTransformer implements FileTransformer {

    async transform(file: FileInfo): Promise<EntryModel[]> {
        return [{
            key: file.path,
            date: file.stats.mtime.toISOString(),
            title: file.path,
            content: file.content
          }];
    }

}
