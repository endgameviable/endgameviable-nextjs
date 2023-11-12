import { Stats, promises as fs } from 'fs';
import path from 'path';

type walkCallback = (
  pathname: string,
  relativePath: string,
  filename: string,
  stat: Stats,
) => Promise<void>;
type filterCallback = (name: string) => boolean;

export function includeAll(name: string): boolean {
  return true;
}

// Scan directory, modified from a ChatGPT example.
// Returns an array of all directory names,
// and an array of all files.
export async function walkDirectory(
  dirRoot: string,
  dirPath: string,
  filterFile: filterCallback,
  filterDir: filterCallback,
  onFile: walkCallback,
): Promise<{ paths: string[]; files: string[] }> {
  const startTime = performance.now();
  const callbackPromises: Promise<void>[] = [];
  const dirs: string[] = [];
  const files: string[] = [];

  async function traverse(dirRoot: string, currentDir: string) {
    dirs.push(currentDir);
    const items = await fs.readdir(path.join(dirRoot, currentDir));

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const itemStats = await fs.stat(path.join(dirRoot, itemPath));

      if (itemStats.isDirectory() && filterDir(item)) {
        await traverse(dirRoot, itemPath);
      } else if (itemStats.isFile() && filterFile(item)) {
        files.push(item);
        if (onFile)
          callbackPromises.push(
            onFile(path.join(dirRoot, itemPath), currentDir, item, itemStats),
          );
      }
    }
  }

  await traverse(dirRoot, dirPath);
  await Promise.all(callbackPromises);

  const elapsed = (performance.now() - startTime).toFixed(2);
  console.log(
    `walkDirectory crawled ${dirs.length} dirs and ${files.length} files in ${elapsed}ms`,
  );
  return { paths: dirs, files: files };
}
