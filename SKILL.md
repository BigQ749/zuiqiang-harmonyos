---
name: zuiqiang-harmonyos
description: >-
  最强鸿蒙开发：按齐赛军习惯做出可上架的鸿蒙单机 App，并覆盖 AGC 发布签名/提审作业单与社交宣传图册。用于鸿蒙 App 开发、迁移、签名、上传、商店资料维护，以及小红书/朋友圈等宣传图制作；Android APK 专项上架用对应安卓技能。
---

# 最强鸿蒙开发

一套技能覆盖三件事：**开发可上架单机 App** · **AGC 上架（签名/草稿/自检/返工）** · **社交宣传图册**。

| 要做什么 | 先读 |
|---|---|
| 做界面、壳、包、商店材料 | 下文「同一轮做到哪」+ taste / preview / shell |
| 签名、作业单、错误码、云测 | [publish/checklist.md](publish/checklist.md)、[publish/reference.md](publish/reference.md) |
| 小红书 / 朋友圈宣传图 | [promo/promo.md](promo/promo.md) |
| 已做过的产品对照 | [products.md](products.md)、[publish/examples.md](publish/examples.md) |

## 2026-10-21 发布入口与规则优先级

下面是当前执行入口；后文和旧参考的固定技术、机器路径、隐私、尺寸或“云测不是必做”等历史默认，只有与当前任务和此入口一致时才采用。它们不是华为的通用硬性规定。

- 生成/升级/交付前先读 [交付契约](references/release-contract.md)，确立平台、品牌、源码、版本、包名和最终文件哈希。
- 后台填写、中文包上传、选择与保存、自检：读 [AGC 草稿流程](references/agc-drafts.md)。上传后启动用户要求的自检并读报告，保存任务 ID；提交审核/协议审核/上架仍遵循用户授权，要求先停时只存草稿。
- 既有托管政策编辑、权限、标签：读 [隐私与权限](references/privacy-permissions.md)。编辑原政策，不擅自新建；保存、生成、审核、生效分开记录；用户协议按真实必填要求处理。
- 相机/图片/相册/二维码/重复日期/返回/提醒/传感器/音频：只读 [运行专项](references/runtime-regressions.md) 中产品具有的能力。
- 排查历史返工和新增经验：读 [真实案例](references/case-ledger.md)，区分用户观察、审核反馈和未验证实现报告。

Web 壳、本机数据、API 12、固定版本码格式、浮动底栏与 1080×1920 都只是既有项目的可覆盖选择。SDK、网络、设备权限、存储和界面按实际产品决定；不为统一模板删真实功能或权限。签名从当前应用确认，不统一使用某款产品的私钥；本机默认文件不能携带密钥和会话凭证。

新应用可沿用后文的界面/壳设计参考；已有应用优先保留包名、签名、数据与用户确认效果。产品并行仅在独立目录和独立后台 tab 且授权允许时进行，不互相覆盖。

主人不写代码。他说清给谁用、做成什么，**同一轮就做**，不要等「开始」，不要问框架、证书、能不能跑命令。按实际需求完成已授权工作；缺少关键事实或遇到不可逆操作边界时按当前会话约束处理。

一次只动一个产品目录。先读那个目录更近的说明。不要把别的产品文案抄过来。

做界面先读 [taste.md](taste.md) 和 [preview.md](preview.md)。他说 iOS 风格一、二或三时读 [styles.md](styles.md) 里对应的那一套，三套不要混。名字没定先读 [naming.md](naming.md)，给出 10 个名称和包名，等他圈一个再写进工程。做壳和白屏先读 [shell.md](shell.md)。图标读 [icons.md](icons.md)。介绍图读 [shots.md](shots.md)。填商店先读 [agc.md](agc.md)。隐私标签读 [privacy-label.md](privacy-label.md)。签名前用 [rejects.md](rejects.md) 过一遍。已做过的产品只作对照，读 [products.md](products.md)。做界面时可再读 [publish/make.md](publish/make.md) 里点名的设计/ArkUI 技能。

## 可覆盖的历史产品默认

- 界面做成网页，放进鸿蒙壳。他亲口说「原生 / ArkTS」才写 `.ets` 界面。
- 完全离线产品不申请不必要网络权限；联网、账号或敏感权限按真实产品需要设计并披露，不把单机当成所有应用默认事实。
- 历史部分项目从 API 12 开始兼容；最低/目标 SDK 根据当前工程、所用 API、设备与上架要求核实，不锁固定版本。
- 包名：他圈定的那个。没圈定之前按 [naming.md](naming.md) 先给 10 个。已有品牌的沿用旧包名（锻体、领宠、想吃先停见 products.md）。新的一律 `com.qisaijun.<拼音>.hmos`，不以 `.huawei` 结尾。
- 版本第一版 `1.0.0`，`versionCode` `1000000`。
- 开发者名用真人：齐赛军。电话邮箱等他亲口给，不编。
- 签名：核对当前应用继承的发布证书及该应用发布 Profile；新产品按实际发布配置选择。口令只在安全本机环境读取，不打印、不进 Git。
- 机器路径见 [defaults.json](defaults.json)。DevEco 不在时先找 `hvigorw.bat`，不要假设盘符。

## 同一轮做到哪

1. 在产品目录写出能点的主路径。电脑打开是一台好看的鸿蒙手机，见 [preview.md](preview.md)。新用户第一眼是正事，不是空列表。
2. 浏览器里点通主路径、空态、点错。把本地地址告诉他。
3. 打成一条 IIFE，拷进 `harmony/.../rawfile`，壳按 [shell.md](shell.md)。
4. 图标按 [icons.md](icons.md)：直角 1024 和 216，和包内是同一张。介绍图按 [shots.md](shots.md)：5 张 1080×1920，同一只手机框。
5. 已有政策按用户要求在原托管记录编辑；用户协议按实际必填情况处理。选择 AGC 隐私托管时，按 [agc.md](agc.md) 与 [privacy-label.md](privacy-label.md) 生成模板红色必填项 1.1、7.1、7.2 的实际内容；不生成 GitHub 隐私网址，不在包内重复预置独立政策页或隐私弹窗。
6. `hvigorw assembleApp` 打未签名 `.app`。先过 [rejects.md](rejects.md)，再用发布证书签到桌面：`<中文名>上传包.app`。签名步骤见 [publish/checklist.md](publish/checklist.md)。
7. 在产品里建 `store/`，用 [scripts/write-listing.mjs](scripts/write-listing.mjs) 写出一句话（≤17 字）、应用介绍和 AGC 填写；AGC 填写要包含隐私托管协议选择、模板必填项及隐私标签。只有主人明确要求自有隐私网站时，才使用 `scripts/publish-privacy.mjs`。介绍必须和真界面一致。
8. 他要看模拟器时再开。没说就不要开。
9. 要做社交宣传图册时，另走 [promo/promo.md](promo/promo.md)，与商店介绍图分开交付。

## 上架专项（publish/）

作业单、发布签名、云测、商店文案红线：[publish/checklist.md](publish/checklist.md)  
命令、错误码、安卓旁支：[publish/reference.md](publish/reference.md)  
历史踩坑对照：[publish/examples.md](publish/examples.md)

## 社交宣传图册（promo/）

入口：[promo/promo.md](promo/promo.md)  
视觉方向：[promo/references/visual-direction.md](promo/references/visual-direction.md)  
真截图与换图交付：[promo/references/production.md](promo/references/production.md)

注意：社交图尺寸（如 3:4）≠ AGC 必填 1080×1920；后者仍用 [shots.md](shots.md)。

## 验收

- 新用户第一屏不是空列表。
- AGC 使用所选隐私管理方式并关联所需协议；1.1、7.1、7.2 必填内容及隐私标签和真实数据处理一致；默认不生成公网隐私网站或包内重复隐私弹窗/政策页。
- 真机壳里没有第二套电量、没有浏览器假手机框。
- 底栏是浮起的圆角条，不盖住系统那条横杠。
- 桌面上的包是签过名的 `.app`，不是 unsigned。
- `store/` 里有一句话、介绍、AGC 填写、直角图标和五张介绍图；AGC 填写包含实际所需协议的配置、状态及隐私模板必填内容。
- 宣传图册（若做）：真界面、可预览总览、版本说明清楚；不编「已上架」或无效下载码。

## 禁止

禁止不实宣传、虚构疗效/资质/用户数据、把网页链接当安装包、用调试签名冒充发布签名、传错平台/包名、密钥进仓库。账号、网络、支付等真实业务不是禁用功能，须按产品范围和适用规则实现。上架专项禁止项见 [publish/checklist.md](publish/checklist.md)。

## 来源

本技能在原「最强鸿蒙开发」基础上，吸收并合并了下列仓库（源仓库保留，未删除）：

1. [harmony-app-publish-skill](https://github.com/BigQ749/harmony-app-publish-skill) — HarmonyOS NEXT 上架 / AGC 提审作业单 → 现 `publish/`
2. [harmony-social-promo-skill](https://github.com/BigQ749/harmony-social-promo-skill) — 鸿蒙 App 社交宣传图册 → 现 `promo/`

重叠的 `references/`（交付契约、AGC 草稿、隐私权限、运行专项、案例台账）以本仓库已有副本为准，两边内容此前已对齐。
