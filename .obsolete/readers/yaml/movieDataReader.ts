import * as path from 'path';
import * as yaml from 'js-yaml';
import { ContentFileReader } from '@/data/interfaces/contentFileReader';
import Entry, { ERROR_ENTRY } from '@/data/interfaces/entry';
import { ContentFile } from '@/data/interfaces/contentFile';
import { safeStringify } from '@/types/strings';
import { TextType } from '@/types/contentText';
import {
  ContentRoute,
  getFullRoute,
  slugifyTitle,
} from '../../interfaces/contentRoute';
import { safeParseDateMillis } from '@/types/dates';

type yamlCache = {
  [key: string]: any;
};

export class MovieDataReader implements ContentFileReader {
  private cache: yamlCache = {};

  public async getRoutes(file: ContentFile): Promise<ContentRoute[]> {
    if (!this.cache[file.name])
      this.cache[file.name] = yaml.load(await file.readContent());
    const data: any = this.cache[file.name];
    const routes: ContentRoute[] = [];
    if (Array.isArray(data.movies)) {
      for (var index: number = 0; index < data.movies.length; index++) {
        const movie = data.movies[index];
        routes.push({
          slug: slugifyTitle(safeStringify(movie.title)),
          route: path.join(file.path, safeStringify(movie.year)),
          source: file,
          element: index,
        });
      }
    }
    return routes;
  }

  public async getEntry(route: ContentRoute): Promise<Entry> {
    if (!this.cache[route.source.name])
      this.cache[route.source.name] = yaml.load(
        await route.source.readContent(),
      );
    const data: any = this.cache[route.source.name];
    if (Array.isArray(data.movies)) {
      const movie = data.movies[route.element];
      const entry: Entry = {
        route: getFullRoute(route),
        timestamp: safeParseDateMillis(movie.last_seen),
        title: movie.title,
        article: new TextType(movie.review, 'text/markdown'),
      };
      return entry;
    }
    return ERROR_ENTRY;
  }
}
