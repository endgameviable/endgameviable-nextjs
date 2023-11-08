import { promises as fs } from 'fs';
import * as path from 'path';

import FileInfo from '@/data/interfaces/fileInfo'
import EntryProvider from '@/data/interfaces/entryProvider';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry from '@/data/interfaces/entry';
import EntryQueryParams, { MATCH_ALL, entryMatchesFilter } from '@/data/interfaces/queryFilter';
import { TextType } from '@/data/interfaces/types';

// ChatGPT basically wrote this function for me so blame it :)
async function walkDirectory(dirPath: string, fileExt: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  async function traverse(currentDir: string) {
    const items = await fs.readdir(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        await traverse(itemPath);
      } else if (itemStats.isFile() && item.endsWith(fileExt)) {
        files.push(new FileInfo(itemPath, itemStats));
      }
    }
  }

  await traverse(dirPath);
  return files;
}

// A provider to scan a local directory and generate Entries from the files there.
export default class ContentDirectoryProvider implements EntryProvider {
  private directoryPath: string;
  private transformer: FileDecoder;

  constructor(directoryPath: string, transformer: FileDecoder) {
    this.directoryPath = path.join(process.cwd(), 'content', directoryPath);
    this.transformer = transformer;
  }

  async getAllEntries(): Promise<Entry[]> {
    return this.queryEntries(MATCH_ALL)
  }

  async queryEntries(filter: EntryQueryParams): Promise<Entry[]> {
    var transformElapsed: number = 0
    const startTime = performance.now()
    const files = await walkDirectory(this.directoryPath, ".md")
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
          console.log("error reading file:", error);
        }
      } else {
        entries.push({
          // A default entry if there's no transform
          timestamp: file.stats.mtimeMs,
          title: "File " + numEntries.toString(),
          summary: new TextType("Contents of " + file.path)
        });
        numEntries++;
      }
    }
    const totalElapsed = performance.now() - startTime
    console.log(`files scanned: ${numFiles}, entries scanned: ${numEntries}, entries returned: ${entries.length}, from: ${this.directoryPath}, files scanned in: ${scanElapsed.toFixed(2)}ms, files transformed in: ${transformElapsed.toFixed(2)}ms, total processed in: ${totalElapsed.toFixed(2)}ms`)
    return entries;
  }
}