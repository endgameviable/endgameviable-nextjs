import * as path from 'path';
import grayMatter from 'gray-matter';
import { ContentFileReader } from "../interfaces/contentFileReader"
import Entry, { ERROR_ENTRY } from "../interfaces/entry"
import { ContentFile } from '../interfaces/contentFile';
import { safeParseDateMillis, safeStringify } from '@/typeConversion';
import { TextType } from '../interfaces/types';
import { ContentRoute } from '../interfaces/contentRoute';

export class MarkdownFileReader implements ContentFileReader {

  // TODO: ugh this is so slow and inefficient
  // because it has to read the file content so often
  
  // Returns all the content routes in the file
  public async getRoutes(file: ContentFile): Promise<ContentRoute[]> {
    // TODO: Need to actually load the markdown
    // We need to fetch the slug from the front matter
    const data = await file.readContent()
    // Decode front matter
    const { data: frontMatter, content } = grayMatter(data);
    if (frontMatter.draft === true) return []
    return [{
      slug: safeStringify(frontMatter.slug, file.name),
      route: file.path,
      source: file,
      element: 0
    }]
  }

  // Returns an Entry based on a Route
  public async getEntry(route: ContentRoute): Promise<Entry> {
    // Read file contents
    const data = await route.source.readContent()
    // Decode front matter
    const { data: frontMatter, content } = grayMatter(data);

    const summary = (frontMatter.summary !== "") ? frontMatter.summary : ""

    if (frontMatter.draft === true) return ERROR_ENTRY

    return {
      route: [route.route, safeStringify(frontMatter.slug, route.slug)].join('/'),
      timestamp: safeParseDateMillis(frontMatter.date),
      title: safeStringify(frontMatter.title, "Untitled"),
      summary: new TextType(summary, "text/plain"),
      article: new TextType(content, "text/markdown")
    };
  }
}
