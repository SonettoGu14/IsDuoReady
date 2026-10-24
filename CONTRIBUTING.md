# Contributing / 参与贡献

## The short version / 简短版

**English:** Report what you observed, on which app version, with screenshots. Do not guess an SDK from a store badge.

**中文：** 报告你实际观察到的结果、应用版本和截图。不要根据商店徽章猜 SDK。

## Evidence rules / 证据规则

| Evidence | What it supports | Display |
| --- | --- | --- |
| `binary` | `DTSDKName` or `LC_BUILD_VERSION` from the app binary | Solid build evidence |
| `developer` | Developer statement or release notes naming the build SDK | Claimed |
| `observed` | Maintainer device test | Verified |
| `community` | Two independent reports with screenshots | Verified by community |
| `inferred` | Layout signatures in screenshots | Dashed badge |
| `unknown` | No evidence | Unrated |

Additional rules:

- A **broken** issue needs a maintainer test or two independent reports, plus an evidence link.
- Record the **tested app version and date**. A newer App Store version marks the entry as needing a recheck; it does not reset the tier.
- Apple's **Made for iPhone Duo** badge is not build evidence.
- Release notes mentioning “Duo” are a lead, not proof of iOS 27.1 SDK.
- `Optimized` describes the build tier. A separate `issues` list records layout failures.

中文补充：

- 红色“有问题”必须有维护者实测或两份独立报告，并附证据链接。
- 必须记录测试版本和日期。商店出现新版本后，只标记“待复核”，不自动降级。
- Apple 的 Duo 徽章不是构建证据；release notes 提到 Duo 也不等于 27.1 SDK。
- `Optimized` 是构建档位，布局问题单独记录在 `issues` 中。

## Add or update an app / 新增或更新应用

1. Use the site's Contribute page or the **App report / 应用报告** issue form.
2. Attach outer-display, inner-display, and half-folded screenshots.
3. A maintainer converts verified reports into a YAML pull request.
4. CI checks the schema, duplicate store IDs, evidence rules, tests, and the production build.

Direct YAML pull requests are welcome. Use one file per app in `src/content/apps/<slug>.yml`.

```yaml
name: "Example"
name_zh: "示例应用"
developer: "Example Inc."
category: productivity
store_id: "123456789"
icon: /icons/example.jpg
build:
  sdk: "27.1"
  evidence: developer
  source: "https://developer.example/duo-update"
  checked: "2026-10-23"
test:
  confidence: verified
  version: "4.1.2"
  os: "27.1"
  date: "2026-10-23"
  by: "@your-handle"
features: [split-view]
issues: []
```

The public model is the three Apple tiers. Do not add a separate checklist of pass/fail requirements in a report; explain briefly why the app belongs to that tier.

公开模型只有 Apple 三档。报告里不需要再附一套“通过/不通过”的检查清单，用一句话说明为什么归入该档位即可。

`rank` is optional. It preserves the curated China chart order for the default list; new community entries can omit it and fall back to name order.

## Developer corrections / 开发者纠错

If the app is yours, use **Data correction / 数据纠错** and say so. A link to release notes, build metadata, or a public statement is enough to start the review. You may also reply to any issue linked from the app entry.

## Run checks / 本地校验

```sh
npm ci
npm run ci
```

## License / 许可

Code contributions are licensed under MIT. Data contributions are licensed under CC BY 4.0. By submitting, you agree to these licenses and confirm that screenshots do not expose private information.
