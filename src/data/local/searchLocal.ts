import path from 'path';
import { promises as fs } from 'fs';
import PageContent from '../interfaces/content';
import EntryQueryParams from '../interfaces/queryFilter';
import { HugoJsonPage, jsonToEntry } from '../s3/fetchFromS3';

export async function searchEntriesLocal(
    params: EntryQueryParams,
): Promise<PageContent[]> {
    console.log(`local search starting`);

    const files = await walkDirectory(
        path.join(process.cwd(), 'content'), 
        '', 
        '.json');
    console.log(`local search found ${files.length} files`);

    const matches: PageContent[] = [];
    const promises: Promise<void>[] = [];
    for (const file of files) {
        promises.push(
            readLocalJSON(file).then((data) => {
                const searchable = [
                    data.title?.toLowerCase(),
                    data.plain?.toLowerCase(),
                    data.summary?.toLowerCase(),
                ].join(' ');
                if (searchable.includes(params.contains.toLowerCase())) {
                    matches.push(jsonToEntry(data));
                }
            })
        );
    }
    await Promise.all(promises);
    if (matches.length > 0) {
        matches.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`local search found ${matches.length} matching pages`);
        return matches;
    }
    console.log(`local search didn't find any matches`);
    return [];
}

async function readLocalJSON(pathname: string): Promise<HugoJsonPage> {
    const body = await fs.readFile(pathname, 'utf8');
    const data: HugoJsonPage = JSON.parse(body);
    return data;
}

// Scan directory, modified from a ChatGPT example
async function walkDirectory(
    dirRoot: string,
    dirPath: string,
    fileExt: string,
  ): Promise<string[]> {
    const dirs: string[] = [];
    const files: string[] = [];
  
    async function traverse(dirRoot: string, currentDir: string) {
      dirs.push(currentDir);
      const items = await fs.readdir(path.join(dirRoot, currentDir));
  
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const itemStats = await fs.stat(path.join(dirRoot, itemPath));
  
        if (itemStats.isDirectory()) {
          await traverse(dirRoot, itemPath);
        } else if (itemStats.isFile() && item.endsWith(fileExt)) {
          files.push(path.join(dirRoot, currentDir, item));
        }
      }
    }
  
    await traverse(dirRoot, dirPath);
    return files;
  }
  