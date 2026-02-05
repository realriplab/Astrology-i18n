import { execSync } from 'child_process';
import { statSync } from 'fs';

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    try {
      const gitDate = execSync(`git log -1 --format="%ci" "${filepath}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (gitDate) {
        file.data.astro.frontmatter.lastModified = new Date(gitDate).toISOString();
        return;
      }
    } catch (e) {
      // Fallback to file system time
    }

    try {
      const result = statSync(filepath);
      file.data.astro.frontmatter.lastModified = result.mtime.toISOString();
    } catch (error) {
      file.data.astro.frontmatter.lastModified = new Date().toISOString();
    }
  };
}
