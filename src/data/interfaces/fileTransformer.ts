import FileInfo from './fileInfo'
import Entry from '@/data/interfaces/entry'

// Transform the contents of a file into something displayable
// Typically used to transform Markdown into a view model
export default interface FileTransformer {
    transform(file: FileInfo): Promise<Entry[]>
}
