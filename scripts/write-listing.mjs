import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("用法: node scripts/write-listing.mjs store/app.json");
  process.exit(1);
}

const app = JSON.parse(fs.readFileSync(file, "utf8"));
const dir = path.dirname(path.resolve(file));
const required = [
  "name",
  "bundle",
  "oneLine",
  "intro",
  "features",
  "dataItems",
  "privacyPurpose",
  "noInfoImpact",
  "retentionDetails",
];

for (const key of required) {
  if (app[key] === undefined || app[key] === null || app[key] === "") {
    console.error("缺少 " + key);
    process.exit(1);
  }
}

if ([...app.oneLine].length > 17) {
  console.error("一句话超过 17 字：" + app.oneLine);
  process.exit(1);
}

const banned = ["官方", "最佳", "首创", "极致", "疗效"];
const listingCopy = app.oneLine + app.intro;
for (const word of banned) {
  if (listingCopy.includes(word)) {
    console.error("文案里有不能用的字：" + word);
    process.exit(1);
  }
}

const items = Array.isArray(app.dataItems) ? app.dataItems : [app.dataItems];
if (items.length === 0 || items.some((item) => !String(item).trim())) {
  console.error("dataItems 至少填写一项真实数据");
  process.exit(1);
}

const localOnly = app.localOnly !== false;
if (!localOnly && !app.serverLocation) {
  console.error("联网应用必须填写真实 serverLocation；不得猜测服务器国家或地区");
  process.exit(1);
}

const retentionMode = app.retentionMode || "minimum";
if (retentionMode !== "minimum" && retentionMode !== "fixed") {
  console.error("retentionMode 只能是 minimum 或 fixed");
  process.exit(1);
}
if (retentionMode === "fixed" && !app.fixedRetention) {
  console.error("固定留存期限必须填写真实 fixedRetention");
  process.exit(1);
}

const serviceMode = app.serviceMode || { enabled: false };
if (
  serviceMode.enabled &&
  (!serviceMode.settingsPath || !serviceMode.basicFeatures || !serviceMode.fullFeatures)
) {
  console.error("真实基本/全量模式必须填写 settingsPath、basicFeatures、fullFeatures");
  process.exit(1);
}

const category = app.dataCategory || "其他信息";
const privacyRows = items
  .map((item) => "- " + item + "；目的：" + app.privacyPurpose + "；存储：" + (localOnly ? "仅在用户设备本机处理，不上传" : "按实际服务器位置及期限处理"))
  .join("\n");

let section11;
if (serviceMode.enabled) {
  section11 = [
    "1.1 条款选择：选择“基本功能服务和全量功能服务”。",
    "应用内设置路径：" + serviceMode.settingsPath,
    "基本功能服务：" + serviceMode.basicFeatures,
    "全量功能服务附加功能：" + serviceMode.fullFeatures,
    "必要信息及处理目的：" + items.join("、") + "；" + app.privacyPurpose,
    "不提供信息的影响：" + app.noInfoImpact,
  ];
} else {
  section11 = [
    "1.1 条款选择：选择“我们为您提供下述功能”，不选择“基本功能服务和全量功能服务”。",
    "产品功能：" + app.features,
    "使用相关功能所必需的信息：" + items.join("、"),
    "处理目的：" + app.privacyPurpose,
    "不提供相关信息的影响：" + app.noInfoImpact,
  ];
}

const section71 =
  retentionMode === "fixed"
    ? [
        "7.1 选项：固定存储期限。",
        "固定期限：" + app.fixedRetention,
        "期限说明：" + app.retentionDetails,
      ]
    : [
        "7.1 选项：选择“我们承诺，除法律法规另有规定外，我们对您的信息的保存期限应当为实现处理目的所必需的最短时间”。",
        "本机留存说明：" + app.retentionDetails,
      ];

const section72 = localOnly
  ? [
      "7.2 建议填写：不涉及服务器；本应用不将用户信息传输或保存到服务器，数据仅在用户设备本机处理。",
      "核对事项：如果 AGC 模板的完整预览仍声称信息会传输并保存到服务器，不要填写虚假的服务器国家/地区；先寻找无服务器选项或向华为确认模板配置，再提交。",
    ]
  : [
      "7.2 服务器存储国家/地区：" + app.serverLocation,
      "存储及传输说明：" + (app.serverStorageDetails || "请按实际服务器部署、备份和传输路径补全，不得只按公司所在地填写。"),
    ];

const agc = [
  "# " + app.name + " · 粘贴到华为 AGC",
  "",
  "## 隐私声明管理方式",
  "选择 AGC 隐私托管，分别创建并关联隐私政策和用户协议。默认不填写自建 GitHub 隐私网址，不把独立隐私政策页或重复的隐私弹窗预置进安装包。",
  "开发者/运营者名称、联系方式及其他账号实名字段：使用 AGC 账号中的真实信息；此处不编造。",
  "",
  "## 模板红色必填项",
  "",
  "### 1. 我们如何收集和使用您的个人信息 · 1.1",
  ...section11,
  "",
  "### 7. 信息存储地点及期限",
  ...section71,
  ...section72,
  "",
  "## 隐私标签",
  "是否涉及个人信息：是（用户主动输入、选择或保存的信息属于个人信息处理范围；逐项以实际功能核对）",
  "业务场景：应用基本功能",
  "数据类别：" + category,
  "数据项及用途：",
  privacyRows,
  "上传服务器：" + (localOnly ? "否" : "按实际服务端处理填写"),
  "设备权限：按实际代码和系统弹窗逐项核对，不用到的能力不申请。",
  "",
  "## 应用信息",
  "应用类型：应用",
  "应用名称：" + app.name,
  "包名：" + app.bundle,
  "分类：" + (app.category || "便捷生活"),
  "一句话简介：" + app.oneLine,
  "图标：直角 PNG，216 或 1024，和安装包里是同一张",
  "介绍图：1080×1920 竖图，用真界面",
  "应用内商品：" + (app.inAppProducts || "无"),
  "备案：按实际上线形态和 AGC 要求核对",
  "",
  "## 应用介绍",
  app.intro.trim(),
  "",
  "## 新版本特性",
  "第一版：" + (app.firstVersion || "提供应用所列功能。"),
  "",
  "## 用户协议",
  "在 AGC 隐私托管中创建并关联用户协议。条款需说明产品基本使用规则、用户内容责任、知识产权、服务变更及联系方式；不要把隐私政策网址当成用户协议。",
  "",
].join("\n");

fs.writeFileSync(path.join(dir, "一句话.txt"), app.oneLine + "\n", "utf8");
fs.writeFileSync(path.join(dir, "应用介绍.txt"), app.intro.trim() + "\n", "utf8");
fs.writeFileSync(path.join(dir, "AGC填写.md"), agc, "utf8");

console.log("已写入 " + dir + "（一句话、应用介绍、AGC 隐私托管填写内容）");
