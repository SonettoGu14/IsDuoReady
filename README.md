# IsDuoReady

**Which apps actually use the Duo?** A bilingual, community-verified index of iPhone Duo app adaptation.

**哪些 app 真的适配了 Duo？** 中英双语的 iPhone Duo 应用适配索引，以构建 SDK 和实机检查为依据。

Live site / 在线站点: **https://sonettogu14.github.io/IsDuoReady/**

## The model / 判定模型

The site follows Apple's three build tiers. `Unrated` and `Known issues` are states, not extra tiers.

本站严格使用 Apple 的三个构建档位；`Unrated`（未评级）和 `Known issues`（已知问题）是状态，不是第四档。

| Tier | Build SDK | What it means |
| --- | --- | --- |
| Optimized / 已优化 | iOS 27.1+ | Edge-to-edge on both displays; vertical system bars. |
| Resizable / 可缩放 | iOS 27.0 | Resizes with the fold; fills most of the inner display. |
| Compatible / 可运行 | iOS 26 or earlier | Runs in a centered compatibility window. |
| Unrated / 未评级 | Unknown | No SDK or device evidence yet. |

Read [Apple's preparation guide](https://developer.apple.com/iphone-duo/prepare/) and the site's **Method / 判定方法** page.

## Develop / 本地开发

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/IsDuoReady/`.

```sh
npm run check:data  # cross-file evidence rules
npm test            # tier, health, URL, and i18n unit tests
npm run check       # Astro + TypeScript diagnostics
npm run build       # static production build
npm run ci          # all of the above
npm run sync        # refresh App Store versions and missing icons
```

## Data / 数据

One YAML file per app in `src/content/apps/`:

```yaml
name: "Fantastical"
developer: "Flexibits Inc."
category: productivity
store_id: "718043190"
icon: /icons/fantastical.jpg
build:
  sdk: unknown
  evidence: unknown
features: [apple-featured]
issues: []
```

Do not infer a build tier from an App Store badge or a marketing sentence alone. See [CONTRIBUTING.md](CONTRIBUTING.md) and [TESTING.md](TESTING.md).

## Contribute / 参与

- Use the site's **Contribute / 参与众测** page to copy a report or open a pre-filled issue.
- Use the **App report / 应用报告** issue form for device evidence.
- Use **Data correction / 数据纠错** for wrong links, versions, tiers, or developer statements.
- Direct YAML pull requests are welcome and must pass CI.

`data/inbox.md` is a lightweight worksheet for testing apps on a phone.

## Deploy / 部署

GitHub Actions builds and deploys to GitHub Pages on every push to `main`.

- `SITE_URL=https://sonettogu14.github.io`
- `BASE_PATH=/IsDuoReady`

For a custom domain, add `public/CNAME`, set `BASE_PATH=/`, and update `SITE_URL`.

A nightly workflow opens a pull request when App Store versions change. It never changes an app's tier automatically. On a fork, enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests** for this workflow.

## License / 许可

Code: [MIT](LICENSE). Data: [CC BY 4.0](LICENSE-DATA).

Independent community project. Not affiliated with Apple Inc. iPhone, iPhone Duo, and App Store are trademarks of Apple Inc. App icons and names belong to their respective owners.
