import { describe, expect, it } from 'vitest';
import { getAppName, getSummary, t } from './i18n';
import type { AppEntry } from './types';

const entry: AppEntry = {
  id: 'sample',
  name: 'Sample',
  developer: 'Developer',
  category: 'productivity',
  build: { sdk: 'unknown', evidence: 'unknown' },
  features: ['apple-featured'],
  issues: [],
};

describe('getAppName', () => {
  it('uses the Chinese name on Chinese pages and falls back to the primary name', () => {
    expect(getAppName({ ...entry, name: 'AMap', name_zh: '高德地图' }, 'zh')).toBe('高德地图');
    expect(getAppName({ ...entry, name: 'AMap', name_zh: '高德地图' }, 'en')).toBe('AMap');
    expect(getAppName({ ...entry, name: 'WeChat' }, 'zh')).toBe('WeChat');
  });
});

describe('t', () => {
  it('returns localized interface copy', () => {
    expect(t('en', 'tier.optimized')).toBe('Optimized');
    expect(t('zh', 'tier.optimized')).toBe('已优化');
  });
});

describe('getSummary', () => {
  it('uses a Chinese summary when available', () => {
    const result = getSummary(
      { ...entry, summary: { en: 'English note.', zh: '中文说明。' } },
      'zh',
    );
    expect(result).toEqual({ text: '中文说明。', isFallback: false });
  });

  it('marks an English summary as a fallback on a Chinese page', () => {
    const result = getSummary({ ...entry, summary: { en: 'English note.' } }, 'zh');
    expect(result).toEqual({ text: 'English note.', isFallback: true });
  });

  it('generates a factual bilingual summary for featured but unrated apps', () => {
    expect(getSummary(entry, 'en').text).toContain('No build or device evidence');
    expect(getSummary(entry, 'zh').text).toContain('尚无构建或实机证据');
  });

  it('qualifies inferred SDK claims instead of stating them as binary facts', () => {
    const inferred = {
      ...entry,
      build: { sdk: '27.1' as const, evidence: 'inferred' as const },
    };
    expect(getSummary(inferred, 'en').text).toContain('suggest');
    expect(getSummary(inferred, 'en').text).toContain('not binary proof');
    expect(getSummary(inferred, 'zh').text).toContain('只是推断');
  });

  it('qualifies developer-claimed SDK tiers', () => {
    const claimed = {
      ...entry,
      build: { sdk: '27.1' as const, evidence: 'developer' as const },
    };
    expect(getSummary(claimed, 'en').text).toContain('claim');
    expect(getSummary(claimed, 'en').text).toContain('not a device verification');
  });
});
