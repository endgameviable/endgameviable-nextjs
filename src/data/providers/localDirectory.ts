import { promises as fs } from 'fs';
import * as path from 'path';

import FileInfo from '@/data/interfaces/fileInfo'
import DataProvider from '@/data/interfaces/dataProvider';
import FileTransformer from '@/data/interfaces/fileTransformer';
import Entry from '@/data/interfaces/entry';

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

// A DataProvider to scan a local directory and generate Entries from the files there.
export default class LocalDirectoryDataProvider implements DataProvider {
  private directoryPath: string;
  private transformer: FileTransformer;

  constructor(directoryPath: string, transformer: FileTransformer) {
    this.directoryPath = path.join(process.cwd(), directoryPath);
    this.transformer = transformer;
  }

  async getEntries(): Promise<Entry[]> {
    const files = await walkDirectory(this.directoryPath, "*")
    const entries: Entry[] = [];
    var index = 0
    for (const file of files) {
      if (this.transformer) {
        try {
          const transformed = await this.transformer.transform(file);
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
          content: await file.getContent()
        });
      }
      index++;
    }
    console.log("entries read:", entries.length)
    return entries;
  }
}