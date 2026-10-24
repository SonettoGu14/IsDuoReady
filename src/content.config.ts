import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const checkValue = z.enum(['pass', 'fail', 'na', 'unknown']);
const dateString = z
  .union([z.string(), z.date()])
  .optional()
  .transform((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value));
const versionString = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => (value === undefined ? undefined : String(value)));

const apps = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    name_zh: z.string().optional(),
    developer: z.string(),
    developer_zh: z.string().optional(),
    rank: z.number().int().positive().optional(),
    category: z.enum([
      'entertainment',
      'sports',
      'productivity',
      'creativity',
      'games',
      'food',
      'shopping',
      'finance',
      'travel',
      'music',
      'reading',
      'navigation',
      'health',
      'social',
      'utilities',
      'weather',
      'education',
    ]),
    store_id: z.string().optional(),
    icon: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    build: z.object({
      sdk: z.enum(['26', '27.0', '27.1', 'unknown']),
      evidence: z.enum(['binary', 'developer', 'observed', 'inferred', 'claimed', 'unknown']),
      source: z.url().optional(),
      checked: dateString,
    }),
    test: z
      .object({
        confidence: z.enum(['verified', 'community', 'claimed', 'inferred', 'unverified']),
        version: versionString,
        os: versionString,
        date: dateString,
        by: z.string().optional(),
        reports: z.number().int().positive().optional(),
        device: z.string().optional(),
        checks: z
          .object({
            outer_full: checkValue.optional(),
            inner_full: checkValue.optional(),
            vertical_bars: checkValue.optional(),
            fold_safe: checkValue.optional(),
            camera_safe: checkValue.optional(),
            split_view: checkValue.optional(),
            continuity: checkValue.optional(),
            media: checkValue.optional(),
            camera: checkValue.optional(),
          })
          .optional(),
      })
      .optional(),
    features: z
      .array(z.enum(['apple-featured', 'hinge-aware', 'dual-display', 'split-view', 'pose-layout', 'camera']))
      .default([]),
    issues: z
      .array(
        z.object({
          title: z.string(),
          severity: z.enum(['minor', 'broken']),
          evidence: z.url().optional(),
        }),
      )
      .default([]),
    summary: z
      .object({
        en: z.string(),
        zh: z.string().optional(),
      })
      .optional(),
    store: z
      .object({
        current_version: versionString,
        current_version_release_date: dateString,
        synced_at: dateString,
      })
      .optional(),
    links: z
      .object({
        website: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { apps };
