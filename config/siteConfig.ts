import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { ContentProvider } from '@/data/interfaces/contentProvider';
import LocalDirectoryProvider from '@/data/readers/localDirectoryProvider';
import { MarkdownFileReader } from '@/data/readers/markdownFileReader';
import { MovieDataReader } from '@/data/readers/yaml/movieDataReader';
import { EldenRingDataReader } from '@/data/readers/yaml/eldenRingDataReader';
import { initStaticConfig } from './gitSync';
import S3Provider from '@/data/readers/s3Provider';

// Very high level site configuration.

type metaData = {
  [key: string]: string;
};

// Site Branding
export const siteConfig: metaData = {
  siteName: 'Endgame Viable Next.js Beta',
  siteUrl: 'https://beta.endgameviable.com',
};

// Default limit to rss feeds and list pages
export const PAGE_SIZE: number = 10;

interface sectionInfo {
  name: string;
  //provider1: EntryProvider
  provider2: ContentProvider;
}

type sections = {
  [key: string]: sectionInfo;
};

async function noInitializer(): Promise<void> {
  // Resolves immediately
  return Promise.resolve<void>(undefined);
}

const s3client = new S3Client({
  region: process.env.AWS_REGION,
});

export const SITE_SECTION_NAMES: string[] = ['s3', 'movies'];

// Configuration of data sources for site content sections.
// For example:
// content/ -> a directory of markdown files
// movies/ -> a yaml file containing movie reviews
export const SITE_SECTIONS: sections = {
  s3: {
    name: 's3',
    provider2: new S3Provider(
      s3client,
      'endgameviable-nextjs-storage',
      'endgameviable-hugo/content/',
      's3',
      '.md',
      ['movies'],
      new MarkdownFileReader(),
    ),
  },
  // content: {
  //   name: 'content',
  //   provider2: new LocalDirectoryProvider(
  //     path.join(process.cwd(), 'content-remote/endgameviable-hugo'),
  //     'content',
  //     '.md',
  //     ['movies'],
  //     new MarkdownFileReader(),
  //     initStaticConfig,
  //   ),
  // },
  movies: {
    name: 'movies',
    provider2: new LocalDirectoryProvider(
      path.join(process.cwd(), 'content'),
      'movies',
      '.yaml',
      [],
      new MovieDataReader(),
      noInitializer,
    ),
  },
  eldenring: {
    name: 'eldenring',
    provider2: new LocalDirectoryProvider(
      path.join(process.cwd(), 'content'),
      'eldenring',
      '.yaml',
      [],
      new EldenRingDataReader(),
      noInitializer,
    ),
  },
};

export function getSectionInfo(name: string): sectionInfo {
  return SITE_SECTIONS[name];
}

export function forEachSection(lambda: (section: sectionInfo) => void) {
  SITE_SECTION_NAMES.forEach((name) => {
    lambda(getSectionInfo(name));
  });
}
