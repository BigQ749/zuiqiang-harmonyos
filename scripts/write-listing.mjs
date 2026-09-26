import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("用法: node scripts/write-listing.mjs store/app.json");
  process.exit(1);
}

const app = JSON.parse(fs.readFileSync(file, "utf8"));
const dir = path.dirname(path.resolve(file));
const need = ["name", "bundle", "oneLine", "intro", "dataItems", "privacyUrl"];
for (const key of need) {
  if (!app[key]) {
    console.error("缺少 " + key);
    process.exit(1);
  }
}
if ([...app.oneLine].length > 17) {
  console.error("一句话超过 17 字：" + app.oneLine);
  process.exit(1);
}

const banned = ["官方", "最佳", "首创", "极致", "疗效"];
const blob = app.oneLine + app.intro;
for (const word of banned) {
  if (blob.includes(word)) {
    console.error("文案里有不能用的字：" + word);
    process.exit(1);
  }
}

const items = Array.isArray(app.dataItems) ? app.dataItems : [app.dataItems];
fs.writeFileSync(path.join(dir, "一句话.txt"), app.oneLine + "\n", "utf8");
fs.writeFileSync(path.join(dir, "应用介绍.txt"), app.intro.trim() + "\n", "utf8");
fs.writeFileSync(
  path.join(dir, "AGC填写.md"),
  `# ${app.name} · 粘贴到华为后台

应用类型：应用
应用名称：${app.name}
包名：${app.bundle}
分类：${app.category || "便捷生活"}
一句话简介：${app.oneLine}
涉及个人信息：是
业务场景：只勾应用基本功能
数据项：${items.join("、")}
上传服务器：否
隐私政策网址：${app.privacyUrl}
隐私权利网址：${app.privacyUrl}
图标：直角 PNG，216 或 1024，和安装包里是同一张
介绍图：1080×1920 竖图，用真界面
设备权限：不勾
应用内商品：无
备案：单机不填

## 应用介绍

${app.intro.trim()}

## 新版本特性

第一版：${app.firstVersion || "可以完成主路径，记录只留在这台手机。"}
`,
  "utf8",
);

fs.writeFileSync(
  path.join(dir, "隐私政策.html"),
  `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${app.name}隐私政策</title>
</head>
<body>
<main>
<h1>${app.name}隐私政策</h1>
<p>${app.name}是装在这台手机上的工具。你写下的${items.join("、")}只保存在这台手机里，不会上传到服务器。</p>
<p>本应用不设账号，不接入广告，不申请网络权限。卸载应用，或在应用里清掉记录，这些内容就删除了。</p>
<p>开发者：齐赛军。包名：${app.bundle}。</p>
</main>
</body>
</html>
`,
  "utf8",
);

console.log("已写入 " + dir);
