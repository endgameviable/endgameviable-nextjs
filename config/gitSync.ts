// Synchronize a remote git repo with a local directory

import fs from 'fs';
import path from 'path';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { syncToS3 } from './s3Sync';

export async function initStaticConfig() {
  const localDir = path.join(
    process.cwd(),
    'content-remote',
    'endgameviable-hugo',
  );
  await syncRepo(
    localDir,
    `https://${process.env.CODECOMMIT_USER}:${process.env.CODECOMMIT_PASS}@${process.env.CODECOMMIT_REPO}`,
  );
  await syncToS3(
    'endgameviable-nextjs-storage',
    'endgameviable-hugo',
    localDir,
  );
}

// Clone and/or pull from a remote git repo.
// Since the Amplify build starts with an empty directory
// every time, this will effectively clone every time
// in a production build situation.
// (I'm somewhat surprised writing to build directories
// like this actually works, but it does.)
async function syncRepo(localDir: string, remoteUrl: string) {
  console.log('syncing repo', localDir);
  const options: Partial<SimpleGitOptions> = {
    baseDir: path.join(process.cwd(), 'content-remote'),
    maxConcurrentProcesses: 6,
    trimmed: false,
  };

  const git: SimpleGit = simpleGit(options);

  if (!fs.existsSync(localDir)) {
    console.log("local directory doesn't exist, cloning repo");
    try {
      // Clone the remote Git repository
      await git.clone(remoteUrl, localDir);
      console.log('Repository cloned successfully.');
    } catch (error) {
      console.error('Error cloning repository:', error);
      return;
    }
  }

  console.log('pulling latest changes from repo');
  return git.cwd(localDir).pull();
}
