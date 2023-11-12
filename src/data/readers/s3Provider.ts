import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';
import Entry, { ERROR_ENTRY } from '@/data/interfaces/entry';
import EntryQueryParams, {
  entryMatchesFilter,
} from '@/data/interfaces/queryFilter';
import { ContentProvider } from '../interfaces/contentProvider';
import { ContentRoute, getFullRoute } from '../interfaces/contentRoute';
import { ContentFileReader } from '../interfaces/contentFileReader';
import { S3FileRoute } from './s3File';
import { safeStringify } from '@/typeConversion';
import path from 'path';

// A provider to scan a local directory and generate Entries from the files there.
export default class S3Provider implements ContentProvider {
  private s3: S3Client;
  private bucket: string;
  private prefix: string;
  private baseRoute: string;
  private fileExtension: string;
  private excludeDirs: string[];
  private transformer: ContentFileReader;
  private routes: ContentRoute[];
  private paths: string[];

  constructor(
    s3: S3Client,
    bucket: string,
    prefix: string,
    baseRoute: string,
    fileExt: string,
    excludeDirs: string[],
    transformer: ContentFileReader,
  ) {
    console.log(`constructing S3Provider for ${bucket}`);
    this.s3 = s3;
    this.bucket = bucket;
    if (!prefix.endsWith('/')) prefix += '/';
    this.prefix = prefix;
    this.baseRoute = baseRoute;
    this.fileExtension = fileExt;
    this.excludeDirs = excludeDirs;
    this.transformer = transformer;
    this.routes = [];
    this.paths = [];
  }

  public async getAllRoutes(): Promise<ContentRoute[]> {
    if (this.routes.length > 0) {
      console.log(
        `getAllRoutes for s3 bucket ${this.bucket} prefix ${this.prefix} returning ${this.routes.length} cached routes`,
      );
      return this.routes;
    }
    console.log(
      `getAllRoutes for s3 bucket ${this.bucket} prefix ${this.prefix} starting scan`,
    );
    const startTime = performance.now();
    const routes: ContentRoute[] = [];
    const uniquePaths = new Set<string>();
    try {
      const contentPromises: Promise<ContentRoute[]>[] = [];
      let continuationToken: string | undefined;
      do {
        const listParams: ListObjectsV2CommandInput = {
          Bucket: this.bucket,
          Prefix: this.prefix,
          MaxKeys: 500,
          ContinuationToken: continuationToken,
        };
        const response = await this.s3.send(
          new ListObjectsV2Command(listParams),
        );
        if (response.Contents) {
          for (const object of response.Contents) {
            const key = safeStringify(object.Key);
            const partialPath = key.slice(this.prefix.length);
            const pathParts = partialPath.split('/');
            const relativePath = path.join(
              pathParts.slice(0, pathParts.length - 1).join('/'),
            );
            // skip files at the root level for now
            if (relativePath === '.') continue;
            uniquePaths.add(relativePath);
            // see if the path contains an excluded dir
            let excluded: boolean = false;
            this.excludeDirs.forEach((dir) => {
              if (pathParts.includes(dir)) excluded = true;
            });
            const filename = pathParts[pathParts.length - 1];
            if (!excluded && filename.endsWith(this.fileExtension)) {
              //console.log('found s3 file', relativePath, filename);
              const file = new S3FileRoute(
                this.s3,
                this.bucket,
                key,
                this.baseRoute,
                relativePath,
                filename,
              );
              contentPromises.push(this.transformer.getRoutes(file));
            }
          }
        }
        continuationToken = response.NextContinuationToken;
      } while (continuationToken);
      // wait for all the files to be read
      console.log('waiting for s3 object downloads to complete');
      const nestedRoutes = await Promise.all(contentPromises);
      // flatten the array of arrays
      nestedRoutes.forEach((r) => routes.push(...r));
      this.routes = [];
      this.routes.push(...routes);
      // generate an array of unique paths
      this.paths = [];
      uniquePaths.forEach((p) => this.paths.push(p));
      const elapsed = performance.now() - startTime;
      console.log(
        `s3 getAllRoutes ${this.bucket} ${this.prefix}: scanned ${
          this.routes.length
        } routes in ${this.paths.length} paths in ${elapsed.toFixed(2)}ms`,
      );
    } catch (error) {
      console.log('error listing bucket objects:', error);
    }
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
