# 介绍图

商店「手机竖图」用本技能里的脚本，不要交整屏裸截图。

成品：3 到 5 张，默认 5 张。每张 PNG **1080×1920**，小于 5 MB。同一底板、同一只手机框。框固定在海报的 `left:184px; top:332px; 712×1512`。框内是 Chrome 按真机 **390×844** 截的网页，加上时间、信号、电量。

标题：应用名、一句 4 到 7 个字、一行副标题。标题变长也不许把手机框顶下去。字和软件里一致。暗色页状态栏用白字。

## 怎么跑

1. 先让这个应用的网页预览能打开。
2. 在产品目录写 `store/shots.json`。样子见 [store/shots.example.json](store/shots.example.json)。`url` 用真能打开的地址。需要演示数据时写入这个应用自己的 localStorage，再打开页面。同一地址不刷新，空状态会被写回去。
3. 在产品目录执行（Chrome 会弹出来）：

```bash
node "%USERPROFILE%\.cursor\skills\最强鸿蒙开发\scripts\store-posters.mjs" store/shots.json
```

产品里要有 `puppeteer-core`。没有就只在这个产品目录安装。

4. 脚本写出 `store/华为介绍图/` 的 PNG、`上传顺序.txt`、`预览.html`。填了 `desktopFolder` 就再拷到桌面。
5. 打开 `预览.html`。五张手机框必须对齐。字被挡住、返回键压标题、暗页状态栏是黑字，就改 `shots.json` 重跑。不要改手机框坐标。

后台让他选【手机竖图】，按序号传。视频可以不传。不要把 `_raw` 中间图给他。
