import * as path from 'path';
import grayMatter from 'gray-matter';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry from '@/data/interfaces/entry';
import { TextType } from '@/data/interfaces/types';
import {
  safeParseDate,
  safeParseDateMillis,
  safeStringify,
} from '@/typeConversion';
import { ContentFile } from '../interfaces/contentFile';

// Transform a Markdown post file to a view model
export default class MarkdownFileDecoder implements FileDecoder {
  async decode(file: ContentFile): Promise<Entry[]> {
    // Read file contents
    const data = await file.readContent();
    // Decode front matter
    const { data: frontMatter, content } = grayMatter(data);

    const summary = frontMatter.summary !== '' ? frontMatter.summary : '';

    if (frontMatter.draft === true) return [];

    return [
      {
        route: path.join(file.path, safeStringify(frontMatter.slug, file.name)),
        timestamp: safeParseDateMillis(frontMatter.date),
        title: safeStringify(frontMatter.title, 'Untitled'),
        summary: new TextType(summary, 'text/plain'),
        article: new TextType(content, 'text/markdown'),
      },
    ];
  }
}
