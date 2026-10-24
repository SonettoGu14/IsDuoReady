import { getCollection, type CollectionEntry } from 'astro:content';
import { compareApps } from './status';
import type { AppEntry, Locale } from './types';

export async function getApps(locale: Locale = 'zh'): Promise<AppEntry[]> {
  const entries = await getCollection('apps');
  return entries
    .map((entry: CollectionEntry<'apps'>) => ({ ...entry.data, id: entry.id }) as AppEntry)
    .sort((a: AppEntry, b: AppEntry) => compareApps(a, b, locale));
}

export function getLatestUpdate(apps: AppEntry[]): string {
  const dates = apps
    .flatMap((app) => [app.test?.date, app.build.checked, app.store?.synced_at])
    .filter((date): date is string => Boolean(date))
    .sort();
  return dates.at(-1) ?? '2026-10-24';
}
