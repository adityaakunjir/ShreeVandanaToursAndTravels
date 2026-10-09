import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['node_modules', '.next', '.git', '.vercel']);
const files = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) await scan(path.join(directory, entry.name));
      continue;
    }
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).replaceAll('\\', '/');
    if (entry.name.startsWith('.env') && entry.name !== '.env.example') continue;
    if (['PROJECT_INDEX.json', 'tsconfig.tsbuildinfo', 'next-env.d.ts'].includes(relative)) continue;
    if (/\.(zip|log)$/i.test(relative)) continue;
    const content = await readFile(absolute);
    files.push({ path: relative, bytes: (await stat(absolute)).size,
      category: relative.startsWith('src/') ? 'application' : relative.startsWith('public/') ? 'public-asset' : relative.startsWith('client_details/') ? 'business-source' : 'supporting',
      sha256: createHash('sha256').update(content).digest('hex') });
  }
}
await scan(root);
files.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(path.join(root, 'PROJECT_INDEX.json'), JSON.stringify({
  reviewDate: '2026-10-09',
  baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  scope: 'Working source, business documents and public assets. Excludes dependencies, builds, Git metadata, credentials and generated index itself.',
  fileCount: files.length, files,
}, null, 2) + '\n');
console.log(`Indexed ${files.length} files.`);
