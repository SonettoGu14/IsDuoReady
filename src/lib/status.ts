import { CORE_CHECKS, type AppEntry, type Confidence, type Locale, type Tier } from './types';

const TIER_ORDER: Record<Tier, number> = {
  optimized: 0,
  resizable: 1,
  compatible: 2,
  unrated: 3,
};

const CONFIDENCE_ORDER: Record<Confidence, number> = {
  verified: 0,
  community: 1,
  claimed: 2,
  inferred: 3,
  unverified: 4,
};

export function getTier(app: AppEntry): Tier {
  switch (app.build.sdk) {
    case '27.1':
      return 'optimized';
    case '27.0':
      return 'resizable';
    case '26':
      return 'compatible';
    default:
      return 'unrated';
  }
}

export function getConfidence(app: AppEntry): Confidence {
  if (app.test?.confidence) return app.test.confidence;
  switch (app.build.evidence) {
    case 'binary':
      return 'verified';
    case 'observed':
      return 'unverified';
    case 'developer':
    case 'claimed':
      return 'claimed';
    case 'inferred':
      return 'inferred';
    default:
      return 'unverified';
  }
}

export function isSolidEvidence(app: AppEntry): boolean {
  const confidence = getConfidence(app);
  return confidence === 'verified' || confidence === 'community';
}

export function getHealth(app: AppEntry): 'ok' | 'minor' | 'broken' | 'unknown' {
  if (app.issues.some((issue) => issue.severity === 'broken')) return 'broken';
  const checks = Object.entries(app.test?.checks ?? {});
  if (checks.some(([key, value]) => CORE_CHECKS.includes(key as never) && value === 'fail')) {
    return 'broken';
  }
  if (app.issues.some((issue) => issue.severity === 'minor')) return 'minor';
  if (checks.some(([, value]) => value === 'fail')) return 'minor';
  return app.test ? 'ok' : 'unknown';
}

export function compareApps(a: AppEntry, b: AppEntry, locale: Locale = 'en'): number {
  const aBroken = getHealth(a) === 'broken' ? 1 : 0;
  const bBroken = getHealth(b) === 'broken' ? 1 : 0;
  if (aBroken !== bBroken) return aBroken - bBroken;

  const tierDifference = TIER_ORDER[getTier(a)] - TIER_ORDER[getTier(b)];
  if (tierDifference !== 0) return tierDifference;

  const confidenceDifference = CONFIDENCE_ORDER[getConfidence(a)] - CONFIDENCE_ORDER[getConfidence(b)];
  if (confidenceDifference !== 0) return confidenceDifference;

  const aRank = a.rank ?? Number.POSITIVE_INFINITY;
  const bRank = b.rank ?? Number.POSITIVE_INFINITY;
  if (aRank !== bRank) return aRank - bRank;

  const aName = locale === 'zh' && a.name_zh ? a.name_zh : a.name;
  const bName = locale === 'zh' && b.name_zh ? b.name_zh : b.name;
  return aName.localeCompare(bName, locale === 'zh' ? 'zh' : 'en');
}

export function isStale(app: AppEntry): boolean {
  const testedVersion = app.test?.version;
  const testedDate = app.test?.date;
  const storeVersion = app.store?.current_version;
  const storeDate = app.store?.current_version_release_date;
  if (!testedVersion || !testedDate || !storeVersion || !storeDate) return false;
  return testedVersion !== storeVersion && Date.parse(storeDate) > Date.parse(testedDate);
}
