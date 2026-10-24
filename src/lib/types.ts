export const SDKS = ['26', '27.0', '27.1', 'unknown'] as const;
export type Sdk = (typeof SDKS)[number];

export const TIERS = ['optimized', 'resizable', 'compatible', 'unrated'] as const;
export type Tier = (typeof TIERS)[number];

export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export const CATEGORIES = [
  'entertainment',
  'sports',
  'productivity',
  'creativity',
  'games',
  'food',
  'shopping',
  'travel',
  'music',
  'reading',
  'navigation',
  'health',
  'social',
  'utilities',
  'weather',
  'education',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const FEATURES = [
  'apple-featured',
  'hinge-aware',
  'dual-display',
  'split-view',
  'pose-layout',
  'camera',
] as const;
export type Feature = (typeof FEATURES)[number];

export const CHECKS = [
  'outer_full',
  'inner_full',
  'vertical_bars',
  'fold_safe',
  'camera_safe',
  'split_view',
  'continuity',
  'media',
  'camera',
] as const;
export type CheckKey = (typeof CHECKS)[number];
export type CheckValue = 'pass' | 'fail' | 'na' | 'unknown';

export const CORE_CHECKS: CheckKey[] = [
  'outer_full',
  'inner_full',
  'vertical_bars',
  'fold_safe',
  'camera_safe',
];

export type BuildEvidence =
  | 'binary'
  | 'developer'
  | 'observed'
  | 'inferred'
  | 'claimed'
  | 'unknown';
export type Confidence = 'verified' | 'community' | 'claimed' | 'inferred' | 'unverified';

export interface BuildInfo {
  sdk: Sdk;
  evidence: BuildEvidence;
  source?: string;
  checked?: string;
}

export interface TestInfo {
  confidence: Confidence;
  version?: string;
  os?: string;
  date?: string;
  by?: string;
  reports?: number;
  device?: string;
  checks?: Partial<Record<CheckKey, CheckValue>>;
}

export interface Issue {
  title: string;
  severity: 'minor' | 'broken';
  evidence?: string;
}

export interface StoreInfo {
  current_version?: string;
  current_version_release_date?: string;
  synced_at?: string;
}

export interface AppEntry {
  id: string;
  name: string;
  name_zh?: string;
  developer: string;
  developer_zh?: string;
  category: Category;
  store_id?: string;
  icon?: string;
  aliases?: string[];
  build: BuildInfo;
  test?: TestInfo;
  features: Feature[];
  issues: Issue[];
  summary?: {
    en: string;
    zh?: string;
  };
  store?: StoreInfo;
  links?: {
    website?: string;
  };
}
