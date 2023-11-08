import grayMatter from 'gray-matter';

import FileInfo from '@/data/interfaces/fileInfo';
import FileDecoder from '@/data/interfaces/fileDecoder'
import Entry from '@/data/interfaces/entry'
import { TextType } from '@/data/interfaces/types';
import { safeParseDate, safeParseDateMillis, safeStringify } from '@/typeConversion';

// Transform a Markdown post file to a view model
export default class MarkdownFileDecoder implements FileDecoder {

    async decode(file: FileInfo): Promise<Entry[]> {
        // Read file contents
        const data = await file.getContent()
        // Decode front matter
        const { data: frontMatter, content } = grayMatter(data);

        if (frontMatter.draft === true)
            return []

        return [{
            timestamp: safeParseDateMillis(frontMatter.date),
            title: safeStringify(frontMatter.title, "Untitled"),
            summary: new TextType("summary"),
            article: new TextType(content, "text/markdown")
          }];
    }

}
