import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { validateApps } from '../src/lib/validate';
import type { AppEntry } from '../src/lib/types';

const directory = new URL('../src/content/apps/', import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith('.yml')).sort();
const apps: AppEntry[] = [];

for (const file of files) {
  const data = parse(await readFile(new URL(file, directory), 'utf8')) as Omit<AppEntry, 'id'>;
  apps.push({ ...data, id: file.replace(/\.yml$/, '') });
}

const errors = validateApps(apps);
if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Validated ${apps.length} apps: no duplicate IDs or evidence-rule violations.`);
