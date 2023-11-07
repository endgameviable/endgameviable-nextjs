import FileInfo from './fileInfo'
import Entry from '@/data/interfaces/entry'

// Decode the contents of a file into displayable entries
// Typically used to transform Markdown into a view model.
// But can also be used to read YAML or JSON files.
export default interface FileDecoder {
    decode(file: FileInfo): Promise<Entry[]>
}