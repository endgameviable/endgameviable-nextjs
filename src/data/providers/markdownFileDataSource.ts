import * as path from 'path';
import grayMatter from 'gray-matter';
import { FileDataSource } from "../interfaces/fileDataSource"
import Entry from "../interfaces/entry"
import { ContentRoute } from '../interfaces/contentRoute';
import { safeParseDateMillis, safeStringify } from '@/typeConversion';
import { TextType } from '../interfaces/types';

export class MarkdownFileDataSource implements FileDataSource {
    private contentFile: ContentRoute

    constructor(contentFile: ContentRoute) {
      this.contentFile = contentFile
    }
        
    public async getRoutes(): Promise<string[]> {
      return [
        path.join(this.contentFile.path, this.contentFile.name)
      ]
    }
  
    public async getEntries(): Promise<Entry[]> {
      // Read file contents
      const data = await this.contentFile.readContent()
      // Decode front matter
      const { data: frontMatter, content } = grayMatter(data);

      const summary = (frontMatter.summary !== "") ? frontMatter.summary : ""

      if (frontMatter.draft === true)
          return []

      return [{
          route: path.join(this.contentFile.path, safeStringify(frontMatter.slug, this.contentFile.name)),
          timestamp: safeParseDateMillis(frontMatter.date),
          title: safeStringify(frontMatter.title, "Untitled"),
          summary: new TextType(summary, "text/plain"),
          article: new TextType(content, "text/markdown")
        }];
    }
  }
  