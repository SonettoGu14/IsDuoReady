import { describe, expect, it } from 'vitest';
import { validateApps } from './validate';
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

describe('validateApps', () => {
  it('accepts a minimal unrated app', () => {
    expect(validateApps([app()])).toEqual([]);
  });

  it('rejects duplicate App Store IDs', () => {
    const errors = validateApps([
      app({ id: 'one', store_id: '123' }),
      app({ id: 'two', store_id: '123' }),
    ]);
    expect(errors.join('\n')).toContain('duplicate store_id');
  });

  it('requires evidence for a known SDK tier', () => {
    const errors = validateApps([app({ build: { sdk: '27.1', evidence: 'unknown' } })]);
    expect(errors.join('\n')).toContain('known SDK requires build evidence');
  });

  it('requires a version, date, and tester for verified device evidence', () => {
    const errors = validateApps([
      app({
        build: { sdk: '27.1', evidence: 'observed' },
        test: { confidence: 'verified', checks: { inner_full: 'pass' } },
      }),
    ]);
    const output = errors.join('\n');
    expect(output).toContain('verified test requires version');
    expect(output).toContain('verified test requires date');
    expect(output).toContain('verified test requires tester');
  });

  it('requires evidence for a broken issue', () => {
    const errors = validateApps([
      app({ issues: [{ title: 'Unusable when folded', severity: 'broken' }] }),
    ]);
    expect(errors.join('\n')).toContain('broken issue requires evidence');
  });

  it('requires a device test when build evidence is observed', () => {
    const errors = validateApps([app({ build: { sdk: '27.1', evidence: 'observed' } })]);
    expect(errors.join('\n')).toContain('observed build evidence requires a device test');
  });

  it('rejects a test date far in the future', () => {
    const errors = validateApps([
      app({
        test: {
          confidence: 'verified',
          version: '1.0',
          os: '27.1',
          date: '2099-01-01',
          by: '@owner',
        },
      }),
    ]);
    expect(errors.join('\n')).toContain('date is in the future');
  });

  it('rejects unknown feature tags', () => {
    const errors = validateApps([app({ features: ['totally-made-up' as never] })]);
    expect(errors.join('\n')).toContain('unknown feature');
  });
});
