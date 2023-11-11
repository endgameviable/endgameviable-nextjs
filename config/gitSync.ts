// Tasks performed at build time

import fs from 'fs';
import path from 'path';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

export async function syncHugoContentDir() {
    console.log("running build tasks")
    await syncRepo('endgameviable-hugo',
        `https://${process.env.CODECOMMIT_USER}:${process.env.CODECOMMIT_PASS}@${process.env.CODECOMMIT_REPO}`)
}

// Clone and/or pull from a remote git repo
async function syncRepo(dirName: string, remoteUrl: string) {
    const localDir = path.join(process.cwd(), "content-remote", dirName)
    const options: Partial<SimpleGitOptions> = {
        baseDir: path.join(process.cwd(), "content-remote"),
        maxConcurrentProcesses: 6,
        trimmed: false,
     };
     
    const git: SimpleGit = simpleGit(options);
  
    if (!fs.existsSync(localDir)) {
        try {
            // Clone the remote Git repository
            await git.clone(remoteUrl, localDir);
            console.log('Repository cloned successfully.');
        } catch (error) {
            //console.error('Error cloning repository:', error);
        }
    }
    git.cwd(localDir)
    git.pull()
}
