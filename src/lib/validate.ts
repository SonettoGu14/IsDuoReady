import { CATEGORIES, FEATURES, type AppEntry } from './types';

export function validateApps(apps: AppEntry[]): string[] {
  const errors: string[] = [];
  const ids = new Map<string, string>();
  const storeIds = new Map<string, string>();

  for (const app of apps) {
    if (ids.has(app.id)) errors.push(`${app.id}: duplicate app id (also ${ids.get(app.id)})`);
    ids.set(app.id, app.id);

    if (app.store_id) {
      if (storeIds.has(app.store_id)) {
        errors.push(
          `${app.id}: duplicate store_id "${app.store_id}" (also ${storeIds.get(app.store_id)})`,
        );
      }
      storeIds.set(app.store_id, app.id);
    }

    if (!CATEGORIES.includes(app.category)) errors.push(`${app.id}: unknown category ${app.category}`);
    for (const feature of app.features) {
      if (!FEATURES.includes(feature)) errors.push(`${app.id}: unknown feature ${feature}`);
    }

    if (app.build.sdk !== 'unknown' && app.build.evidence === 'unknown') {
      errors.push(`${app.id}: known SDK requires build evidence`);
    }
    if (
      app.build.evidence === 'observed' &&
      (!app.test || !['verified', 'community'].includes(app.test.confidence))
    ) {
      errors.push(`${app.id}: observed build evidence requires a device test`);
    }

    if (app.test?.confidence === 'verified') {
      if (!app.test.version) errors.push(`${app.id}: verified test requires version`);
      if (!app.test.date) errors.push(`${app.id}: verified test requires date`);
      if (!app.test.os) errors.push(`${app.id}: verified test requires os`);
      if (!app.test.by) errors.push(`${app.id}: verified test requires tester`);
    }
    if (app.test?.confidence === 'community' && (app.test.reports ?? 0) < 2) {
      errors.push(`${app.id}: community test requires at least two reports`);
    }

    for (const issue of app.issues) {
      if (issue.severity === 'broken' && !issue.evidence) {
        errors.push(`${app.id}: broken issue requires evidence`);
      }
    }

    for (const date of [app.test?.date, app.build.checked, app.store?.synced_at]) {
      if (date && Number.isNaN(Date.parse(date))) errors.push(`${app.id}: invalid date ${date}`);
      if (date && Date.parse(date) > Date.now()) errors.push(`${app.id}: date is in the future: ${date}`);
    }
  }

  return errors;
}
