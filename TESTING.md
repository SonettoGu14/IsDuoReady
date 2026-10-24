# The 30-second Duo tier check / 30 秒判断三档

Test on iPhone Duo, not only in a desktop browser or App Store preview. Record the app version and iOS version.

请在 iPhone Duo 实机上测试，不要只看商店预览。记录应用版本和 iOS 版本。

## 1. Open the app unfolded / 展开后打开

- **Centered window with empty space** → **能运行 / Compatible** (iOS 26 SDK or earlier).
- **Nearly full width, but a strip remains along the status-bar edge** → **能缩放 / Resizable** (iOS 27.0 SDK).
- **Edge-to-edge, with toolbars or tab bars vertical below the status bar** → **已适配 / Optimized** (iOS 27.1 SDK or later).

These are visual inferences, not binary proof. Custom bars may not become vertical, and inspectors or split-view sidebars can legitimately stay horizontal.

这些是视觉推断，不是二进制证明。自定义栏可能不会竖排，inspector 或分栏侧边栏也可能合理地保持横向。

## 2. Close it / 合上检查外屏

An optimized app should use the full cover display. Compatible and Resizable apps can leave unused space. Do not use the App Store badge as evidence.

已适配的 app 应使用完整外屏；能运行和能缩放可以留空。不要用 App Store 徽章当证据。

## 3. Stop when it is ambiguous / 看不准就停

If the layout does not clearly match one tier, record **不确定 / 未评级**. Do not guess.

如果布局不能明确归入某一档，记 **不确定 / 未评级**，不要猜。

## What to submit / 需要提交

- App name and App Store link / 应用名称与商店链接
- Tested app version and iOS version / 测试应用版本与系统版本
- Observed tier / 观察到的档位
- One line explaining why / 一句话说明判断依据
- Outer, inner, and half-folded screenshots / 外屏、内屏和半折截图

Use the site's Contribute page or `data/inbox.md` while testing.
