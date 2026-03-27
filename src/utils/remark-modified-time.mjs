import { execSync } from 'child_process';
import { resolve } from 'path';
import { statSync } from 'fs';

let modifiedTimeByFile;
let repoRoot;

function getRepoRoot() {
  if (repoRoot) return repoRoot;
  try {
    repoRoot = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    repoRoot = process.cwd();
  }
  return repoRoot;
}

function getModifiedTimeMap() {
  if (modifiedTimeByFile) return modifiedTimeByFile;

  modifiedTimeByFile = new Map();

  try {
    const output = execSync('git log --format="%ci" --name-only -- src/content', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    let currentDate = '';
    for (const rawLine of output.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;

      if (/^\d{4}-\d{2}-\d{2} /.test(line)) {
        currentDate = new Date(line).toISOString();
        continue;
      }

      if (currentDate && !modifiedTimeByFile.has(line)) {
        modifiedTimeByFile.set(line, currentDate);
      }
    }
  } catch {
    // Fallback to filesystem time when git history is unavailable.
  }

  return modifiedTimeByFile;
}

function lookupModifiedTime(filepath) {
  const map = getModifiedTimeMap();
  const root = getRepoRoot();
  const relativePath = filepath.startsWith(root) ? filepath.slice(root.length + 1) : filepath;
  return map.get(relativePath) || map.get(filepath);
}

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    const gitDate = lookupModifiedTime(filepath);
    if (gitDate) {
      file.data.astro.frontmatter.lastModified = gitDate;
      return;
    }

    try {
      const result = statSync(resolve(filepath));
      file.data.astro.frontmatter.lastModified = result.mtime.toISOString();
    } catch (error) {
      file.data.astro.frontmatter.lastModified = new Date().toISOString();
    }
  };
}
