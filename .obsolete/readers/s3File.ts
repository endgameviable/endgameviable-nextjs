import path from 'path';
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ContentFile, getBaseName } from '@/data/interfaces/contentFile';

export class S3FileRoute implements ContentFile {
  public path: string = 'S3FileRoute path todo';
  public name: string = 'S3FileRoute name todo';
  private s3: S3Client;
  private bucket: string;
  private key: string;

  constructor(
    s3: S3Client,
    bucket: string,
    key: string,
    baseRoute: string,
    relativePath: string,
    filename: string,
  ) {
    this.s3 = s3;
    this.bucket = bucket;
    this.key = key;
    this.path = path.join(baseRoute, relativePath);
    this.name = getBaseName(filename);
  }

  public async readContent(): Promise<string> {
    try {
      const params: GetObjectCommandInput = {
        Bucket: this.bucket,
        Key: this.key,
      };
      const response = await this.s3.send(new GetObjectCommand(params));
      if (response.Body) return response.Body?.transformToString();
    } catch (error) {
      console.log('error loading file:', error);
    }
    return 'unable to read content from s3 object';
  }
}
