---
name: zuiqiang-harmonyos
description: >-
  最强鸿蒙开发。主人说出要求后，直接做出能在鸿蒙手机打开、并按华为应用市场上架的单机 App：好看的网页真机、图标、介绍截图、一句话和介绍、包名、发布签名、隐私页、AGC 每栏，并避开以前被打回的错。Use when 做鸿蒙、鸿蒙 App、HarmonyOS、华为应用市场、AGC、上架、HAP、上传包、应用图标、介绍图、一句话简介、想吃先停、正确时刻、锻体、下节课、月信、课时、场记、领宠、边译。
---

# 最强鸿蒙开发

主人不写代码。他说清给谁用、做成什么，**同一轮就做**，不要等「开始」，不要问框架、证书、能不能跑命令。技术全部按本技能的默认。只有违法、或会删掉他已有数据时才停。

一次只动一个产品目录。先读那个目录更近的说明。不要把别的产品文案抄过来。

做界面先读 [taste.md](taste.md) 和 [preview.md](preview.md)。做壳和白屏先读 [shell.md](shell.md)。图标读 [icons.md](icons.md)。介绍图读 [shots.md](shots.md)。填商店先读 [agc.md](agc.md)。隐私标签读 [privacy-label.md](privacy-label.md)。签名前用 [rejects.md](rejects.md) 过一遍。已做过的产品只作对照，读 [products.md](products.md)。

## 锁死的默认

- 界面做成网页，放进鸿蒙壳。他亲口说「原生 / ArkTS」才写 `.ets` 界面。
- 单机。不申请 `INTERNET`。数据只在这台手机。
- 最低鸿蒙 5：`compatibleSdkVersion` `5.0.0(12)`，`targetSdkVersion` `26.0.0`。
- 包名：`com.qisaijun.<短拼音>.hmos`。已有品牌的沿用旧包名（锻体、领宠、想吃先停见 products.md）。
- 版本第一版 `1.0.0`，`versionCode` `1000000`。
- 开发者名用真人：齐赛军。电话邮箱等他亲口给，不编。
- 签名：锻体那把发布证书（`D:\APP\zhugu\.sdks\harmony-sign\duanti.p12`，别名 `duanti`）。每个应用自己的发布 `.p7b`。口令在 `password.txt`，读来用，**禁止打印、禁止进 git**。
- 机器路径见 [defaults.json](defaults.json)。DevEco 不在时先找 `hvigorw.bat`，不要假设盘符。

## 同一轮做到哪

1. 在产品目录写出能点的主路径。电脑打开是一台好看的鸿蒙手机，见 [preview.md](preview.md)。新用户第一眼是正事，不是空列表。
2. 浏览器里点通主路径、空态、点错。把本地地址告诉他。
3. 打成一条 IIFE，拷进 `harmony/.../rawfile`，壳按 [shell.md](shell.md)。
4. 图标按 [icons.md](icons.md)：直角 1024 和 216，和包内是同一张。介绍图按 [shots.md](shots.md)：5 张 1080×1920，同一只手机框。
5. `hvigorw assembleApp` 打未签名 `.app`。先过 [rejects.md](rejects.md)，再用发布证书签到桌面：`<中文名>上传包.app`。
6. 在产品里建 `store/`，用 [scripts/write-listing.mjs](scripts/write-listing.mjs) 写出一句话（≤17 字）、应用介绍、AGC 填写。再用 [scripts/publish-privacy.mjs](scripts/publish-privacy.mjs) 把隐私页推到 GitHub Pages，得到 `https://bigq749.github.io/<名字>-privacy/`，写进 AGC。介绍必须和真界面一致。
7. 他要看模拟器时再开。没说就不要开。

## 验收

- 新用户第一屏不是空列表。
- 真机壳里没有第二套电量、没有浏览器假手机框。
- 底栏是浮起的圆角条，不盖住系统那条横杠。
- 桌面上的包是签过名的 `.app`，不是 unsigned。
- `store/` 里有一句话、介绍、AGC 填写、直角图标、五张介绍图，以及一条已公开的 `https://bigq749.github.io/<名字>-privacy/`。

## 禁止

官方、最佳、首创、极致、疗效、真扣款、云账号、把网页链接当 App、调试证书上传、包名以 `.huawei` 结尾、鸿蒙和安卓共用一个包名、密钥进仓库。
