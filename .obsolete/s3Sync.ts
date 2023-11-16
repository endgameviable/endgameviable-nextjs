import path from 'path';
import { Stats, promises as fs } from 'fs';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { includeAll, walkDirectory } from '@/data/utilities/walkDir';

// Upload a local directory to an s3 bucket
export async function syncToS3(
  s3Bucket: string,
  bucketPath: string,
  rootDir: string,
) {
  console.log('syncing with s3 bucket', s3Bucket);
  const startTime = performance.now();
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
  });
  var numUploads: number = 0;
  const promises: Promise<PutObjectCommandOutput>[] = [];
  try {
    console.log('scanning files to upload');
    await walkDirectory(
      rootDir,
      '.',
      includeAll,
      includeAll,
      async (
        pathname: string,
        relativePath: string,
        filename: string,
        stat: Stats,
      ): Promise<void> => {
        const uploadParams = {
          Bucket: s3Bucket,
          Key: path.join(bucketPath, relativePath, filename),
          Body: await fs.readFile(pathname, 'utf8'),
        };
        numUploads++;
        promises.push(s3.send(new PutObjectCommand(uploadParams)));
        return Promise.resolve();
      },
    );
    console.log('finished scanning files');
    await Promise.all(promises);
    const elapsed = (performance.now() - startTime).toFixed(2);
    console.log(`finished uploading ${numUploads} files in ${elapsed}ms`);
  } catch (error) {
    console.log(error);
  }
}
