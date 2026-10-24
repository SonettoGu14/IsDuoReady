import { describe, expect, it } from 'vitest';
import { appPath, assetPath, localePath, normalizeBase, switchLocalePath } from './url';

describe('normalizeBase', () => {
  it('normalizes root and project-page base paths', () => {
    expect(normalizeBase('/')).toBe('');
    expect(normalizeBase('/IsDuoReady/')).toBe('/IsDuoReady');
    expect(normalizeBase('IsDuoReady')).toBe('/IsDuoReady');
  });
});

describe('localePath', () => {
  it('builds unprefixed Chinese and prefixed English project-page URLs', () => {
    expect(localePath('zh', '/', '/IsDuoReady')).toBe('/IsDuoReady/');
    expect(localePath('en', '/', '/IsDuoReady')).toBe('/IsDuoReady/en/');
    expect(localePath('zh', '/method/', '/IsDuoReady')).toBe('/IsDuoReady/method/');
    expect(localePath('en', '/method/', '/IsDuoReady')).toBe('/IsDuoReady/en/method/');
  });

  it('does not double-prefix the base path', () => {
    expect(appPath('en', 'fantastical', '/IsDuoReady')).toBe(
      '/IsDuoReady/en/app/fantastical/',
    );
  });
});

describe('assetPath', () => {
  it('keeps public assets under the GitHub Pages base path', () => {
    expect(assetPath('/icons/fantastical.jpg', '/IsDuoReady')).toBe(
      '/IsDuoReady/icons/fantastical.jpg',
    );
    expect(assetPath('favicon.svg', '/')).toBe('/favicon.svg');
  });
});

describe('switchLocalePath', () => {
  it('preserves the current page when switching languages', () => {
    expect(switchLocalePath('/IsDuoReady/app/fantastical/', 'en', '/IsDuoReady')).toBe(
      '/IsDuoReady/en/app/fantastical/',
    );
    expect(switchLocalePath('/IsDuoReady/en/app/fantastical/', 'zh', '/IsDuoReady')).toBe(
      '/IsDuoReady/app/fantastical/',
    );
  });
});
