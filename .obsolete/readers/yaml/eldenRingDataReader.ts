import * as path from 'path';
import * as yaml from 'js-yaml';
import { ContentFileReader } from '@/data/interfaces/contentFileReader';
import Entry from '@/data/interfaces/entry';
import { ContentFile } from '@/data/interfaces/contentFile';
import { safeStringify } from '@/types/strings';
import { TextType } from '@/types/contentText';
import {
  ContentRoute,
  getFullRoute,
  slugifyTitle,
} from '@/data/interfaces/contentRoute';

type yamlCache = {
  [key: string]: any;
};

export class EldenRingDataReader implements ContentFileReader {
  private cache: yamlCache = {};

  public async getRoutes(file: ContentFile): Promise<ContentRoute[]> {
    if (!this.cache[file.name])
      this.cache[file.name] = yaml.load(await file.readContent());
    const data: any = this.cache[file.name];
    const routes: ContentRoute[] = [];
    var index: number = 0;
    for (const key in data) {
      const video = data[key];
      routes.push({
        slug: slugifyTitle(safeStringify(key)),
        route: path.join(file.path),
        source: file,
        element: index,
      });
      index++;
    }
    return routes;
  }

  public async getEntry(route: ContentRoute): Promise<Entry> {
    if (!this.cache[route.source.name])
      this.cache[route.source.name] = yaml.load(
        await route.source.readContent(),
      );
    const data: any = this.cache[route.source.name];
    var index: number = 0;
    var video,
      filename: string = '';
    for (const key in data) {
      filename = key;
      video = data[key];
      if (index == route.element) break;
      index++;
    }

    const entry: Entry = {
      route: getFullRoute(route),
      timestamp: parseDateStringToEpochMillis(filename.slice(3, 17)),
      title: video.t,
      article: new TextType(video.d, 'text/plain'),
    };
    return entry;
  }
}

// Yay ChatGPT
function parseDateStringToEpochMillis(dateString: string): number {
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(4, 6), 10) - 1; // Months are 0-indexed
  const day = parseInt(dateString.slice(6, 8), 10);
  const hours = parseInt(dateString.slice(8, 10), 10);
  const minutes = parseInt(dateString.slice(10, 12), 10);
  const seconds = parseInt(dateString.slice(12, 14), 10);

  const date = new Date(year, month, day, hours, minutes, seconds);

  return date.getTime(); // Returns Unix epoch timestamp in milliseconds
}
