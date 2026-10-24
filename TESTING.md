# The 30-second Duo check / 30 秒 Duo 实机检查

Test on iPhone Duo, not only in a desktop browser or App Store preview. Record the app version and iOS version.

请在 iPhone Duo 实机上测试，不要只看商店预览。记录应用版本和 iOS 版本。

## 1. Open the app unfolded / 展开后打开

- **Centered window with empty space** → likely **Compatible / 可运行** (iOS 26 SDK or earlier).
- **Nearly full width, but a strip remains along the status-bar edge** → likely **Resizable / 可缩放** (iOS 27.0 SDK).
- **Edge-to-edge, with toolbars or tab bars vertical below the status bar** → likely **Optimized / 已优化** (iOS 27.1 SDK or later).

These are visual inferences, not binary proof. Custom bars may not become vertical, and inspectors or split-view sidebars can legitimately stay horizontal.

这些是视觉推断，不是二进制证明。自定义栏可能不会竖排，inspector 或分栏侧边栏也可能合理地保持横向。

## 2. Fold it halfway / 半折

Check that buttons, sheets, subtitles, and the keyboard are not cut by the folding region. Content should move or split deliberately.

检查按钮、弹窗、字幕和键盘是否被折叠区域切断。内容应主动移开或分栏。

## 3. Close it / 合上检查外屏

Controls should avoid the camera corner. The app should not leave a large unused band.

控件应避开摄像头角落，不应留下整条空白。

## 4. Try Split View and continuity / 检查分屏与连续性

Open a second app beside it, then fold and unfold. Both apps should resize correctly. Your scroll position, video, call, or draft should survive.

并排打开第二个 app，再折叠和展开。两者都应正确缩放，滚动位置、视频、通话或草稿不应丢失。

## 5. Media and camera, if applicable / 媒体与相机（如适用）

Faces, subtitles, and key content should not be cropped. Camera direction and previews should remain correct across displays.

人脸、字幕和关键内容不应被裁切；跨屏时摄像头方向和预览应保持正确。

## What to submit / 需要提交

- App name and App Store link / 应用名称与商店链接
- Tested app version and iOS version / 测试应用版本与系统版本
- Observed tier / 观察到的档位
- Pass/fail results for the checks / 各项通过情况
- Outer, inner, and half-folded screenshots / 外屏、内屏和半折截图
- Reproduction steps for any failure / 失败项的复现步骤

Use the site's Contribute page or `data/inbox.md` while testing.
