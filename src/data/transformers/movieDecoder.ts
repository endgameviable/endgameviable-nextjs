import * as path from 'path';
import * as yaml from 'js-yaml';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry from '@/data/interfaces/entry';
import { TextType } from '@/data/interfaces/types';
import { safeParseDateMillis, safeStringify } from '@/typeConversion';
import { ContentFile } from '../interfaces/contentFile';

// Parse movie entries from a single YAML file into view models
export default class MovieDecoder implements FileDecoder {
  private route: string;

  constructor(route: string) {
    this.route = route;
  }

  async decode(file: ContentFile): Promise<Entry[]> {
    const data: any = yaml.load(await file.readContent());
    const entries: Entry[] = [];
    if (Array.isArray(data.movies)) {
      let index = 0;
      for (const movie of data.movies) {
        const entry: Entry = {
          route: path.join(
            this.route,
            safeStringify(movie.year),
            safeStringify(movie.title),
          ),
          timestamp: safeParseDateMillis(movie.last_seen),
          title: movie.title,
          article: new TextType(movie.review, 'text/markdown'),
        };
        entries.push(entry);
        index++;
      }
    }
    return entries;
  }
}
