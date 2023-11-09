import { Stats, promises as fs } from 'fs';
import * as path from 'path';

import { LocalFileRoute } from '@/data/providers/localFile'
import EntryProvider from '@/data/interfaces/entryProvider';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry, { ERROR_ENTRY } from '@/data/interfaces/entry';
import EntryQueryParams, { MATCH_ALL_ENTRIES, entryMatchesFilter } from '@/data/interfaces/queryFilter';
import { TextType } from '@/data/interfaces/types';
import { ContentFile } from '../interfaces/contentFile';

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
export default class LocalDirectorySource {
  private baseRoute: string
  private directoryPath: string
  private fileExtension: string
  private excludeDirs: string[]
  private transformer: FileDecoder

  constructor(baseRoute: string,
    fileExt: string,
    excludeDirs: string[],
    transformer: FileDecoder) {
    this.baseRoute = baseRoute
    this.directoryPath = path.join(process.cwd(), 'content')
    this.fileExtension = fileExt
    this.excludeDirs = excludeDirs
    this.transformer = transformer
  }

  async getEntry(route: ContentFile): Promise<Entry> {
    if (this.transformer) {
      try {
        const transformed = await this.transformer.decode(route);
        transformed.filter((entry) => entry.route == path.join(route.path, route.name))
        // should only be one result
        return transformed[0]
      } catch (error) {
        console.log("error decoding file:", error);
      }
    } else {
      console.log("error, no decoder")
    }
    return ERROR_ENTRY
  }

  async getAllEntries(): Promise<Entry[]> {
    return this.queryEntries(MATCH_ALL_ENTRIES)
  }

  async queryEntries(filter: EntryQueryParams): Promise<Entry[]> {
    var transformElapsed: number = 0
    const startTime = performance.now()
    const files = await walkDirectory(this.directoryPath,
      this.baseRoute,
      this.fileExtension,
      this.excludeDirs)
    const scanElapsed = performance.now() - startTime
    const entries: Entry[] = [];
    var numFiles: number = 0
    var numEntries: number = 0
    for (const file of files) {
      numFiles++
      if (this.transformer) {
        try {
          const transformStartTime = performance.now()
          const transformed = await this.transformer.decode(file);
          transformElapsed += performance.now() - transformStartTime
          numEntries += transformed.length
          entries.push(...transformed.filter((entry) => entryMatchesFilter(entry, filter)))
        } catch (error) {
          console.log("error decoding file:", error);
        }
      } else {
        entries.push({
          // A default entry if there's no transform
          // This is really a failure condition though
          route: file.pathname,
          timestamp: new Date().getTime(),
          title: "Missing File Decoder",
          article: new TextType(await file.readContent())
        });
        numEntries++;
      }
    }
    const totalElapsed = performance.now() - startTime
    console.log(`files scanned: ${numFiles}, entries scanned: ${numEntries}, entries returned: ${entries.length}, from: ${this.directoryPath}, files scanned in: ${scanElapsed.toFixed(2)}ms, files transformed in: ${transformElapsed.toFixed(2)}ms, total processed in: ${totalElapsed.toFixed(2)}ms`)
    return entries;
  }
}