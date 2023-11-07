import grayMatter from 'gray-matter';

import FileInfo from '@/data/interfaces/fileInfo';
import FileDecoder from '@/data/interfaces/fileDecoder'
import Entry from '@/data/interfaces/entry'
import { TextType } from '@/data/interfaces/types';
import { safeParseDate } from '@/typeConversion';

// Transform a Markdown post file to a view model
export default class MarkdownFileDecoder implements FileDecoder {

    async decode(file: FileInfo): Promise<Entry[]> {
        // Read file contents
        const data = await file.getContent()
        // Decode front matter
        const { data: frontMatter, content } = grayMatter(data);
        const entryDate = safeParseDate(frontMatter.date)

        return [{
            key: file.path,
            date: entryDate,
            title: file.path,
            summary: new TextType("summary"),
            content: new TextType(content, "text/markdown")
          }];
    }

}
