import type { Locale } from './types';

export function normalizeBase(base = '/'): string {
  const trimmed = base.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
}

function normalizePagePath(path: string): string {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export function localePath(locale: Locale, path: string, base = import.meta.env.BASE_URL): string {
  const localePrefix = locale === 'en' ? '/en' : '';
  return `${normalizeBase(base)}${localePrefix}${normalizePagePath(path)}`;
}

export function appPath(locale: Locale, slug: string, base = import.meta.env.BASE_URL): string {
  return localePath(locale, `/app/${slug}/`, base);
}

export function assetPath(path: string, base = import.meta.env.BASE_URL): string {
  return `${normalizeBase(base)}/${path.replace(/^\/+/, '')}`;
}

export function switchLocalePath(
  currentPath: string,
  targetLocale: Locale,
  base = import.meta.env.BASE_URL,
): string {
  const normalizedBase = normalizeBase(base);
  let path = currentPath.startsWith(normalizedBase)
    ? currentPath.slice(normalizedBase.length)
    : currentPath;
  if (path.startsWith('/en/')) path = path.slice(3);
  if (path === '/en') path = '/';
  return localePath(targetLocale, path, base);
}
