import { promises as fs } from 'fs';
import * as path from 'path';

import FileInfo from '@/data/interfaces/fileInfo'
import EntryProvider from '@/data/interfaces/entryProvider';
import FileDecoder from '@/data/interfaces/fileDecoder';
import Entry from '@/data/interfaces/entry';
import { plainToHTML } from '../transformers/html';

// ChatGPT basically wrote this function for me so blame it :)
async function walkDirectory(dirPath: string, filePattern: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  //const pattern: RegExp = new RegExp(filePattern);

  async function traverse(currentDir: string) {
    const items = await fs.readdir(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        await traverse(itemPath);
      } else if (itemStats.isFile()) {
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
    var transformElapsed: number = 0
    const startTime = performance.now()
    const files = await walkDirectory(this.directoryPath, "*")
    const entries: Entry[] = [];
    var index = 0
    for (const file of files) {
      if (this.transformer) {
        try {
          const transformStartTime = performance.now()
          const transformed = await this.transformer.decode(file);
          transformElapsed += performance.now() - transformStartTime
          entries.push(...transformed);
          index += transformed.length
        } catch (error) {
          console.log("error reading file:", error);
        }
      } else {
        entries.push({
          key: index.toString(),
          date: file.stats.mtime,
          title: "File " + index.toString(),
          content: await file.getContent(),
          renderContentAsHTML: plainToHTML
        });
      }
      index++;
    }
    const elapsed = performance.now() - startTime
    console.log(`entries read: ${entries.length}, from: ${this.directoryPath}, in: ${elapsed.toFixed(2)}ms, transformations: ${transformElapsed.toFixed(2)}ms`)
    return entries;
  }
}