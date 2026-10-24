import { describe, expect, it } from 'vitest';
import { getSummary, t } from './i18n';
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
});
