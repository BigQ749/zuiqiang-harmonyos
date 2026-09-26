import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const file = process.argv[2];
if (!file) {
  console.error("用法: node scripts/publish-privacy.mjs store/app.json");
  process.exit(1);
}

const app = JSON.parse(fs.readFileSync(file, "utf8"));
if (!app.privacyRepo || !/^[a-z0-9]+-privacy$/.test(app.privacyRepo)) {
  console.error("privacyRepo 要像 bianyi-privacy");
  process.exit(1);
}

const items = (Array.isArray(app.dataItems) ? app.dataItems : [app.dataItems]).filter(Boolean);
const url = `https://bigq749.github.io/${app.privacyRepo}/`;
const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${app.name}隐私政策</title>
<style>
body{margin:0;background:#f7f6f3;color:#161815;font:16px/1.75 "PingFang SC","Microsoft YaHei",sans-serif}
main{max-width:40rem;margin:0 auto;padding:2.5rem 1.25rem 4rem}
h1{font-size:1.8rem;letter-spacing:.06em;margin:.2rem 0 .6rem}
h2{font-size:1.05rem;margin:1.6rem 0 .4rem}
p,li{color:#3d3933}
.meta{color:#6d726c;font-size:14px}
</style>
</head>
<body>
<main>
<h1>${app.name}隐私政策</h1>
<p class="meta">适用于${app.name}（包名 ${app.bundle}）。开发者：齐赛军。</p>
<p>${app.intro || app.name + "是装在这台手机上的工具。"}</p>
<h2>写在这台手机上的内容</h2>
<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
<p>这些内容只保存在这台手机里，不上传服务器，不设账号，不接入广告。</p>
<h2>怎么删掉</h2>
<p>在应用里清掉记录，或直接卸载。卸载之后，手机里的这些内容就没有了。</p>
</main>
</body>
</html>
`;

const work = fs.mkdtempSync(path.join(os.tmpdir(), "privacy-"));
fs.writeFileSync(path.join(work, "index.html"), html, "utf8");
const git = (args) =>
  execFileSync("git", args, {
    cwd: work,
    encoding: "utf8",
    env: { ...process.env, GIT_AUTHOR_NAME: "齐赛军", GIT_AUTHOR_EMAIL: "saijunqi@gmail.com", GIT_COMMITTER_NAME: "齐赛军", GIT_COMMITTER_EMAIL: "saijunqi@gmail.com" },
  });
git(["init", "-b", "main"]);
git(["add", "index.html"]);
git(["commit", "-m", `${app.name}隐私页`]);

let exists = true;
try {
  execFileSync("gh", ["repo", "view", `BigQ749/${app.privacyRepo}`], { stdio: "ignore" });
} catch {
  exists = false;
}
if (!exists) {
  execFileSync("gh", ["repo", "create", app.privacyRepo, "--public", "--source", work, "--remote", "origin", "--push"], { stdio: "inherit" });
} else {
  git(["remote", "add", "origin", `https://github.com/BigQ749/${app.privacyRepo}.git`]);
  git(["push", "-u", "origin", "main"]);
}

const pages = path.join(work, "pages.json");
fs.writeFileSync(pages, JSON.stringify({ source: { branch: "main", path: "/" } }));
try {
  execFileSync("gh", ["api", "--method", "POST", `repos/BigQ749/${app.privacyRepo}/pages`, "--input", pages], { stdio: "ignore" });
} catch {
  // 已经开过 Pages 时会失败，地址不变。
}
console.log(url);
