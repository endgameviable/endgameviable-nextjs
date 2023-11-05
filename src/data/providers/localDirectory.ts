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

    // TODO: probably should get file timestamp
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        await traverse(itemPath);
      } else if (itemStats.isFile()) {
        const itemContent = await fs.readFile(itemPath, 'utf8');
        files.push({path: itemPath, stats: itemStats, content: itemContent});
      }
    }
  }

  await traverse(dirPath);
  return files;
}

export default class LocalDirectoryDataProvider implements DataProvider {
  private directoryPath: string;
  private transformer: FileTransformer;

  constructor(directoryPath: string, transformer: FileTransformer) {
    this.directoryPath = path.join(process.cwd(), directoryPath);
    this.transformer = transformer;
  }

  async getEntries(): Promise<Entry[]> {
    const results = await walkDirectory(this.directoryPath, "*");
    const entries: Entry[] = [];
    var index = 0
    for (const result of results) {
      if (this.transformer) {
        try {
          const transformed = await this.transformer.transform(result);
          entries.push(...transformed);
        } catch (error) {
          console.log("error reading file:", error);
        }
      } else {
        entries.push({
          key: index.toString(),
          date: result.stats.mtime.toISOString(),
          title: "File " + index.toString(),
          content: result.content
        });
      }
      index++;
    }
    return entries;
  }
}