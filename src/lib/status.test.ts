import { describe, expect, it } from 'vitest';
import {
  compareApps,
  getConfidence,
  getHealth,
  getTier,
  isSolidEvidence,
  isStale,
} from './status';
import type { AppEntry } from './types';

function app(overrides: Partial<AppEntry> = {}): AppEntry {
  return {
    id: 'sample',
    name: 'Sample',
    developer: 'Developer',
    category: 'productivity',
    build: { sdk: 'unknown', evidence: 'unknown' },
    features: [],
    issues: [],
    ...overrides,
  };
}

describe('getTier', () => {
  it('maps the three Apple SDK build tiers exactly', () => {
    expect(getTier(app({ build: { sdk: '27.1', evidence: 'developer' } }))).toBe('optimized');
    expect(getTier(app({ build: { sdk: '27.0', evidence: 'observed' } }))).toBe('resizable');
    expect(getTier(app({ build: { sdk: '26', evidence: 'binary' } }))).toBe('compatible');
  });

  it('does not guess a tier when SDK evidence is missing', () => {
    expect(getTier(app())).toBe('unrated');
  });
});

describe('getConfidence', () => {
  it('prefers device-test confidence over build evidence', () => {
    const entry = app({
      build: { sdk: '27.1', evidence: 'developer' },
      test: {
        confidence: 'verified',
        version: '1.0',
        os: '27.1',
        date: '2026-10-23',
        by: '@owner',
        checks: { inner_full: 'pass' },
      },
    });
    expect(getConfidence(entry)).toBe('verified');
  });

  it('maps build-only evidence without inventing a device test', () => {
    expect(getConfidence(app({ build: { sdk: '27.1', evidence: 'developer' } }))).toBe('claimed');
    expect(getConfidence(app({ build: { sdk: '27.1', evidence: 'inferred' } }))).toBe('inferred');
    expect(getConfidence(app())).toBe('unverified');
  });

  it('only treats verified and community evidence as solid', () => {
    expect(isSolidEvidence(app({ build: { sdk: '27.1', evidence: 'developer' } }))).toBe(false);
    expect(isSolidEvidence(app({ build: { sdk: '27.1', evidence: 'binary' } }))).toBe(true);
  });
});

describe('getHealth', () => {
  it('marks core layout failures as broken regardless of SDK tier', () => {
    const entry = app({
      build: { sdk: '27.1', evidence: 'developer' },
      test: {
        confidence: 'verified',
        version: '1.0',
        os: '27.1',
        date: '2026-10-23',
        by: '@owner',
        checks: { inner_full: 'pass', fold_safe: 'fail' },
      },
    });
    expect(getHealth(entry)).toBe('broken');
  });

  it('keeps non-core failures as minor issues', () => {
    const entry = app({
      test: {
        confidence: 'community',
        version: '1.0',
        os: '27.1',
        date: '2026-10-23',
        reports: 2,
        checks: { split_view: 'fail' },
      },
    });
    expect(getHealth(entry)).toBe('minor');
  });

  it('does not claim an untested app is healthy', () => {
    expect(getHealth(app())).toBe('unknown');
  });
});

describe('compareApps', () => {
  it('sorts by tier, puts broken apps last, then uses the name', () => {
    const optimized = app({ id: 'z', name: 'Zulu', build: { sdk: '27.1', evidence: 'developer' } });
    const compatible = app({ id: 'a', name: 'Alpha', build: { sdk: '26', evidence: 'binary' } });
    const broken = app({
      id: 'b',
      name: 'Broken',
      build: { sdk: '27.1', evidence: 'developer' },
      issues: [{ title: 'Clipped', severity: 'broken', evidence: 'https://example.com/issue' }],
    });
    expect([broken, compatible, optimized].sort(compareApps).map((entry) => entry.id)).toEqual([
      'z',
      'a',
      'b',
    ]);
  });
});

describe('isStale', () => {
  it('flags a newer store version released after the device test', () => {
    const entry = app({
      test: {
        confidence: 'verified',
        version: '1.0',
        os: '27.1',
        date: '2026-10-20',
        by: '@owner',
        checks: { inner_full: 'pass' },
      },
      store: {
        current_version: '1.1',
        current_version_release_date: '2026-10-22',
        synced_at: '2026-10-23',
      },
    });
    expect(isStale(entry)).toBe(true);
  });

  it('does not flag an app without a device-tested version', () => {
    expect(isStale(app())).toBe(false);
  });
});
