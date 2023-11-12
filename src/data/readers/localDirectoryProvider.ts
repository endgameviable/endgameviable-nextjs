import { Stats, existsSync, promises as fs } from 'fs';
import * as path from 'path';

import { LocalFileRoute } from '@/data/providers/localFile';
import Entry, { ERROR_ENTRY } from '@/data/interfaces/entry';
import EntryQueryParams, {
  MATCH_ALL_ENTRIES,
  entryMatchesFilter,
} from '@/data/interfaces/queryFilter';
import { ContentProvider } from '../interfaces/contentProvider';
import { ContentRoute, getFullRoute } from '../interfaces/contentRoute';
import { ContentFileReader } from '../interfaces/contentFileReader';

// Scan directory, modified from a ChatGPT example
// Returns an array of all directory names,
// and an array of all files.
async function walkDirectory(
  dirRoot: string,
  dirPath: string,
  fileExt: string,
  excludeDirs: string[],
): Promise<{ paths: string[]; files: LocalFileRoute[] }> {
  const dirs: string[] = [];
  const files: LocalFileRoute[] = [];

  async function traverse(dirRoot: string, currentDir: string) {
    dirs.push(currentDir);
    const items = await fs.readdir(path.join(dirRoot, currentDir));

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const itemStats = await fs.stat(path.join(dirRoot, itemPath));

      if (itemStats.isDirectory() && !excludeDirs.includes(item)) {
        await traverse(dirRoot, itemPath);
      } else if (itemStats.isFile() && item.endsWith(fileExt)) {
        files.push(new LocalFileRoute(dirRoot, currentDir, item, itemStats));
      }
    }
  }

  await traverse(dirRoot, dirPath);
  return { paths: dirs, files: files };
}

// A provider to scan a local directory and generate Entries from the files there.
export default class LocalDirectoryProvider implements ContentProvider {
  private init: () => Promise<void>;
  private baseRoute: string;
  private directoryPath: string;
  private fileExtension: string;
  private excludeDirs: string[];
  private transformer: ContentFileReader;
  private routes: ContentRoute[];
  private paths: string[];

  constructor(
    directoryPath: string,
    baseRoute: string,
    fileExt: string,
    excludeDirs: string[],
    transformer: ContentFileReader,
    init: () => Promise<void>,
  ) {
    this.baseRoute = baseRoute;
    this.directoryPath = directoryPath;
    this.fileExtension = fileExt;
    this.excludeDirs = excludeDirs;
    this.transformer = transformer;
    this.init = init;
    this.routes = [];
    this.paths = [];
  }

  public async getAllRoutes(): Promise<ContentRoute[]> {
    // if (this.init && !existsSync(this.directoryPath)) {
    //   console.log(`initializing ${this.directoryPath}`)
    //   await this.init()
    // }
    if (this.routes.length > 0) {
      console.log(
        `getAllRoutes ${this.baseRoute}: returning ${this.routes.length} cached routes`,
      );
      return this.routes;
    }
    const startTime = performance.now();
    const results = await walkDirectory(
      this.directoryPath,
      this.baseRoute,
      this.fileExtension,
      this.excludeDirs,
    );
    this.paths = results.paths;
    const promises: Promise<ContentRoute[]>[] = [];
    results.files.forEach((file) => {
      promises.push(this.transformer.getRoutes(file));
    });
    const routes: ContentRoute[] = [];
    const nestedRoutes = await Promise.all(promises);
    nestedRoutes.forEach((r) => routes.push(...r));
    const elapsed = performance.now() - startTime;
    console.log(
      `getAllRoutes ${this.baseRoute}: scanned ${
        routes.length
      } routes in ${elapsed.toFixed(2)}ms`,
    );
    this.routes = [];
    this.routes.push(...routes);
    return this.routes;
  }

  public async getAllPaths(): Promise<string[]> {
    if (this.paths.length > 0) return this.paths;
    await this.getAllRoutes();
    return this.paths;
  }

  public async getAllEntries(): Promise<Entry[]> {
    const routes = await this.getAllRoutes();
    const promises: Promise<Entry>[] = [];
    // Parallelize reading each file
    for (const route of routes) {
      promises.push(this.transformer.getEntry(route));
    }
    return Promise.all(promises);
  }

  public async getEntries(filter: EntryQueryParams): Promise<Entry[]> {
    const entries = await this.getAllEntries();
    return entries.filter((entry) => entryMatchesFilter(entry, filter));
  }

  public async getEntry(route: string): Promise<Entry> {
    const routes = await this.getAllRoutes();
    const entryRoute = routes.find((t) => getFullRoute(t) === route);
    if (entryRoute === undefined) return ERROR_ENTRY;
    return this.transformer.getEntry(entryRoute);
  }
}
