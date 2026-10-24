import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';

type StoreResult = {
  version?: string;
  currentVersionReleaseDate?: string;
  artworkUrl512?: string;
  artworkUrl100?: string;
};

const appsDirectory = new URL('../src/content/apps/', import.meta.url);
const today = new Date().toISOString().slice(0, 10);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function exists(url: URL): Promise<boolean> {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

async function lookup(storeId: string): Promise<StoreResult | null> {
  for (const country of ['cn', 'us']) {
    const url = new URL('https://itunes.apple.com/lookup');
    url.searchParams.set('id', storeId);
    url.searchParams.set('country', country);
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'IsDuoReady/0.1' } });
      if (response.ok) {
        const payload = await response.json();
        if (payload.resultCount > 0) return payload.results[0];
      }
    } catch {
      // Try the next storefront.
    }
    await delay(200);
  }
  return null;
}

const files = (await readdir(appsDirectory)).filter((file) => file.endsWith('.yml')).sort();
let changedFiles = 0;

for (const file of files) {
  const fileUrl = new URL(file, appsDirectory);
  const original = await readFile(fileUrl, 'utf8');
  const data = parse(original);
  const slug = file.replace(/\.yml$/, '');
  if (!data.store_id) {
    console.log(`${slug}: no store ID, skipped`);
    continue;
  }

  const result = await lookup(String(data.store_id));
  if (!result) {
    console.warn(`${slug}: App Store lookup failed`);
    continue;
  }

  const nextStore = {
    current_version: result.version ?? data.store?.current_version,
    current_version_release_date:
      result.currentVersionReleaseDate?.slice(0, 10) ?? data.store?.current_version_release_date,
    synced_at: today,
  };
  const previousVersion = data.store?.current_version;
  const storeChanged =
    previousVersion !== nextStore.current_version ||
    data.store?.current_version_release_date !== nextStore.current_version_release_date;

  let iconChanged = false;
  if (data.icon) {
    const iconUrl = new URL(`../public${data.icon}`, import.meta.url);
    if (!(await exists(iconUrl))) {
      const artwork = result.artworkUrl512 ?? result.artworkUrl100;
      if (artwork) {
        const response = await fetch(artwork);
        if (response.ok) {
          await writeFile(iconUrl, new Uint8Array(await response.arrayBuffer()));
          iconChanged = true;
        }
      }
    }
  }

  if (storeChanged || iconChanged) {
    data.store = nextStore;
    await writeFile(fileUrl, stringify(data));
    changedFiles++;
    console.log(
      `${slug}: ${previousVersion ?? 'unknown'} -> ${nextStore.current_version}${iconChanged ? ' + icon' : ''}`,
    );
  } else {
    console.log(`${slug}: unchanged (${nextStore.current_version})`);
  }
  await delay(250);
}

console.log(`Sync complete: ${changedFiles} files changed.`);
