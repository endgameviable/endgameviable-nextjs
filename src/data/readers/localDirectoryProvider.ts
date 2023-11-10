import { Stats, promises as fs } from 'fs';
import * as path from 'path';

import { LocalFileRoute } from '@/data/providers/localFile'
import Entry, { ERROR_ENTRY } from '@/data/interfaces/entry';
import EntryQueryParams, { MATCH_ALL_ENTRIES, entryMatchesFilter } from '@/data/interfaces/queryFilter';
import { ContentProvider } from '../interfaces/contentProvider';
import { ContentRoute, getFullRoute } from '../interfaces/contentRoute';
import { ContentFileReader } from '../interfaces/contentFileReader';

// Modified from a ChatGPT example
async function walkDirectory(dirRoot: string, 
  dirPath: string, 
  fileExt: string, 
  excludeDirs: string[]): Promise<LocalFileRoute[]> {

  const files: LocalFileRoute[] = [];

  async function traverse(dirRoot: string, currentDir: string) {
    const items = await fs.readdir(path.join(dirRoot, currentDir));

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const itemStats = await fs.stat(path.join(dirRoot, itemPath));

      if (itemStats.isDirectory() && !excludeDirs.includes(item)) {
        await traverse(dirRoot, itemPath);
      } else if (itemStats.isFile() && item.endsWith(fileExt)) {
        files.push(
          new LocalFileRoute(dirRoot, 
            currentDir, item, itemStats))
      }
    }
  }

  await traverse(dirRoot, dirPath);
  return files;
}

// A provider to scan a local directory and generate Entries from the files there.
export default class LocalDirectoryProvider implements ContentProvider {
  private baseRoute: string
  private directoryPath: string
  private fileExtension: string
  private excludeDirs: string[]
  private transformer: ContentFileReader
  private routes: ContentRoute[]

  constructor(baseRoute: string,
    fileExt: string,
    excludeDirs: string[],
    transformer: ContentFileReader) {
    this.baseRoute = baseRoute
    this.directoryPath = path.join(process.cwd(), 'content')
    this.fileExtension = fileExt
    this.excludeDirs = excludeDirs
    this.transformer = transformer
    this.routes = []
  }

  public async getAllRoutes(): Promise<ContentRoute[]> {
    if (this.routes.length > 0) {
      return this.routes
    }
    const files = await walkDirectory(this.directoryPath,
      this.baseRoute,
      this.fileExtension,
      this.excludeDirs)
    const promises: Promise<ContentRoute[]>[] = []
    files.forEach((file) => {
      promises.push(this.transformer.getRoutes(file))
    })
    const routes: ContentRoute[] = []
    const nestedRoutes = await Promise.all(promises)
    nestedRoutes.forEach((r) => routes.push(...r))
    this.routes = routes
    return routes
  }

  public async getAllEntries(): Promise<Entry[]> {
    const routes = await this.getAllRoutes()
    const promises: Promise<Entry>[] = []
    // Parallelize reading each file
    for (const route of routes) {
      promises.push(this.transformer.getEntry(route))
    }
    return Promise.all(promises)
  }

  public async getEntries(filter: EntryQueryParams): Promise<Entry[]> {
    const entries = await this.getAllEntries()
    return entries.filter((entry) => entryMatchesFilter(entry, filter))
  }

  public async getEntry(route: string): Promise<Entry> {
    const routes = await this.getAllRoutes()
    const entryRoute = routes.find((t) => getFullRoute(t) === route)
    if (entryRoute === undefined) return ERROR_ENTRY
    return this.transformer.getEntry(entryRoute)
  }
}