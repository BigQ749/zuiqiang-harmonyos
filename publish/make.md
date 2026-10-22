# 做鸿蒙 App

用户要做能在鸿蒙手机上打开的 App 时读这份。签名、商店、提审仍用 [checklist.md](checklist.md) 与根目录 [SKILL.md](../SKILL.md)。

壳的做法以根目录 [SKILL.md](../SKILL.md)「可覆盖的历史产品默认」为准：界面做成网页，打成一条 IIFE，放进鸿蒙壳。用户明确说「原生」「ArkTS」或「ArkUI」时，才写 `.ets`。

一次只做界面技能里的三份。页面写到当前产品目录，不要写进技能目录。

## 做界面时读

1. `hmos-design-visual-mobile`：华为手机的颜色、字号、标题栏、底栏、列表。
2. `mobile-app-ui-design`：手机流程、拇指区、空态和错态。
3. `impeccable`：用 Operate 模式打磨成品。这是手机里办事的界面，不要做成落地页，不要自定义鼠标，不要超大网页标题。

配色和字体查 `ui-ux-pro-max` 里的 `scripts/search.py`。

画面要脱离通用模板时再读 `frontend-design`。主路径、表单、空态和错态再读 `frontend-ux-engineer`。这两份按需另开，不和上面三份叠成一次全读。

本机没有某一份时，按该条这一句话做，继续做界面。

## 写原生时再读

- 第一份 `.ets` 之前读 `hmos-arkui-develop-skill`。
- 具体页面和交互读 `hmos-arkui-scenario-development`。
- API 对不上时查 `harmony-next` 的离线文档。模拟器点击、下载工具、自动去 GitHub 提 issue，先问主人。
- 分层乱了读 `hmos-arkui-mvvm-pattern`。
- 卡片展开那种一镜到底读 `hmos-arkui-longtake-transition`。
- 写完要审读 `harmonyos-review`。

`harmonyos-dev` 和 `harmonyos-development` 在改已有原生工程、对架构或报错时再读。

## 验收

手机宽度能点完主路径。空态和错态看过。桌面和窄屏都看过。能打开之后，上架再按 [checklist.md](checklist.md)。
