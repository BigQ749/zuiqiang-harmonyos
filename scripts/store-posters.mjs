import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const configPath = process.argv[2];
if (!configPath) {
  console.error("用法: node store-posters.mjs <shots.json>");
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(path.resolve(configPath), "utf8"));
const OUT = path.resolve(cfg.outDir || "store/华为介绍图");
const RAW = path.join(OUT, "_raw");
const BASE = cfg.base;
const CHROME = process.env.CHROME || cfg.chrome || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const W = 1080;
const H = 1920;
const ground = cfg.ground || "#f3f1ee";
const ink = cfg.ink || "#1d1d1f";
const accent = cfg.accent || "#c23b22";
const storageKey = cfg.storageKey || "";
const ready = cfg.ready || "body";
const shots = cfg.shots || [];

if (!BASE || !shots.length) {
  console.error("shots.json 需要 base 和 shots");
  process.exit(1);
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function posterHtml(shot, imgData) {
  const dark = !!shot.dark;
  return `<!doctype html>
<html lang="zh-CN"><meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body { background: ${ground}; color: ${ink}; font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif; }
  .mark { position: absolute; width: 42px; height: 42px; border-color: rgba(29,29,31,.38); border-style: solid; }
  .tl { left: 36px; top: 36px; border-width: 2px 0 0 2px; }
  .tr { right: 36px; top: 36px; border-width: 2px 2px 0 0; }
  .bl { left: 36px; bottom: 36px; border-width: 0 0 2px 2px; }
  .br { right: 36px; bottom: 36px; border-width: 0 2px 2px 0; }
  .copy { position: absolute; left: 80px; right: 80px; top: 72px; text-align: center; }
  .kicker { display: inline-flex; align-items: center; gap: 12px; font-size: 28px; letter-spacing: .18em; color: #8a8178; }
  .pause { width: 4px; height: 22px; border-radius: 2px; background: ${accent}; }
  h1 { margin-top: 14px; font-size: 78px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
  .sub { margin-top: 12px; font-size: 28px; color: #6e6862; }
  .phone { position: absolute; left: 184px; top: 332px; width: 712px; height: 1512px; background: #141414; border-radius: 64px; box-shadow: 0 28px 70px rgba(29,29,31,.18); padding: 12px; }
  .screen { width: 688px; height: 1488px; border-radius: 52px; overflow: hidden; background: #f2f2f7; position: relative; }
  .screen img { width: 688px; height: 1488px; display: block; object-fit: fill; }
  .island { position: absolute; left: 50%; top: 18px; transform: translateX(-50%); width: 108px; height: 30px; border-radius: 16px; background: #0c0c0c; z-index: 2; }
  .status { position: absolute; left: 0; right: 0; top: 0; height: 54px; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 0 28px 0 36px; color: ${dark ? "#fff" : "#1d1d1f"}; font: 600 18px "Segoe UI", "PingFang SC", sans-serif; }
  .status .right { display: flex; align-items: center; gap: 7px; }
  .sig { width: 17px; height: 12px; display: flex; align-items: flex-end; gap: 2px; }
  .sig i { width: 3px; border-radius: 1px; background: currentColor; display: block; }
  .bat { width: 25px; height: 12px; border: 1.5px solid currentColor; border-radius: 3px; position: relative; }
  .bat::before { content: ""; position: absolute; left: 2px; top: 2px; bottom: 2px; width: 16px; background: currentColor; border-radius: 1px; }
  .bat::after { content: ""; position: absolute; right: -4px; top: 3px; width: 2px; height: 5px; background: currentColor; border-radius: 0 1px 1px 0; }
</style>
<body>
  <i class="mark tl"></i><i class="mark tr"></i><i class="mark bl"></i><i class="mark br"></i>
  <div class="copy">
    <div class="kicker"><i class="pause"></i>${esc(shot.kicker || cfg.kicker)}</div>
    <h1>${esc(shot.title)}</h1>
    <p class="sub">${esc(shot.sub)}</p>
  </div>
  <div class="phone"><div class="screen">
    <img src="${imgData}" alt="" />
    <div class="status"><b>9:41</b><span class="right"><span class="sig"><i style="height:4px"></i><i style="height:7px"></i><i style="height:10px"></i><i style="height:12px"></i></span><span class="bat"></span></span></div>
    <i class="island"></i>
  </div></div>
</body></html>`;
}

fs.mkdirSync(RAW, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: cfg.headless === true ? true : false,
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 },
  args: ["--hide-scrollbars", "--font-render-hinting=none", ...(cfg.webgl ? [] : ["--disable-gpu"]), ...(cfg.chromeArgs || [])],
});

try {
  for (const shot of shots) {
    const page = await browser.newPage();
    if (storageKey && cfg.seed) {
      const data = { ...cfg.seed };
      if (shot.welcome && "onboarded" in data) data.onboarded = false;
      await page.evaluateOnNewDocument((key, json) => {
        localStorage.setItem(key, json);
      }, storageKey, JSON.stringify(data));
    }
    const target = new URL(shot.url, BASE);
    target.searchParams.set("_", String(Date.now()));
    await page.goto(target.toString(), { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(shot.ready || ready, { timeout: 20000 }).catch(() => {});
    if (cfg.shotClass) {
      await page.evaluate((cls) => {
        const root = document.querySelector(".app-root") || document.body;
        cls.split(/\s+/).filter(Boolean).forEach((c) => root.classList.add(c));
      }, cfg.shotClass);
    }
    if (shot.eval) {
      await new Promise((r) => setTimeout(r, shot.evalWait || 900));
      await page.evaluate(shot.eval);
    }
    if (shot.reloadTo) {
      await page.goto(shot.reloadTo, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector(shot.ready || ready, { timeout: 20000 }).catch(() => {});
    }
    if (Array.isArray(shot.clicks)) {
      for (const sel of shot.clicks) {
        await page.waitForSelector(sel, { timeout: 15000 });
        await page.click(sel);
        await new Promise((r) => setTimeout(r, shot.clickWait || 500));
      }
    }
    if (typeof shot.scroll === "number") {
      await page.evaluate((sel, top) => {
        const sc = document.querySelector(sel) || document.scrollingElement;
        if (sc) sc.scrollTop = top;
      }, shot.scrollSelector || ".app-phone .overflow-y-auto, .app-phone .no-bar", shot.scroll);
    }
    await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll("img")];
      await Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((ok) => {
        img.addEventListener("load", ok, { once: true });
        img.addEventListener("error", ok, { once: true });
      }))));
    });
    await new Promise((r) => setTimeout(r, shot.wait || 700));
    const rawPath = path.join(RAW, shot.file);
    await page.screenshot({ path: rawPath, type: "png" });
    await page.close();
    const b64 = fs.readFileSync(rawPath).toString("base64");
    const poster = await browser.newPage();
    await poster.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await poster.setContent(posterHtml(shot, `data:image/png;base64,${b64}`), { waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 200));
    await poster.screenshot({ path: path.join(OUT, shot.file), type: "png" });
    await poster.close();
    console.log("ok", shot.file);
  }
} finally {
  await browser.close();
}

const lines = [
  `${cfg.kicker || "应用"} · 华为应用介绍图`,
  "规格：竖屏 PNG 1080×1920。手机框位置每张一致。",
  "在华为后台选【手机竖图】，按序号上传。",
  "",
  ...shots.map((s, i) => `${String(i + 1).padStart(2, "0")}  ${s.file}  ${s.title}`),
];
fs.writeFileSync(path.join(OUT, "上传顺序.txt"), lines.join("\n"), "utf8");
const preview = `<!doctype html><meta charset="utf-8"><title>${esc(cfg.kicker)} 介绍图</title>
<style>body{margin:0;background:#2a2a2a;color:#fff;font-family:"Microsoft YaHei",sans-serif}h1{font-size:18px;font-weight:500;padding:16px 20px 0}p{margin:6px 20px 16px;color:#bbb}.row{display:flex;gap:16px;padding:0 20px 32px;overflow-x:auto}img{height:78vh;border-radius:8px}figcaption{margin-top:8px;font-size:13px}</style>
<h1>${esc(cfg.kicker)} · 介绍图</h1><p>左右滑动。手机框位置每张一样。</p><div class="row">
${shots.map((s, i) => `<figure><img src="${esc(s.file)}" /><figcaption>${i + 1} ${esc(s.title)}</figcaption></figure>`).join("")}
</div>`;
fs.writeFileSync(path.join(OUT, "预览.html"), preview, "utf8");

if (cfg.desktopFolder) {
  const desk = path.join(process.env.USERPROFILE || os.homedir(), "Desktop", cfg.desktopFolder);
  fs.mkdirSync(desk, { recursive: true });
  for (const shot of shots) fs.copyFileSync(path.join(OUT, shot.file), path.join(desk, shot.file));
  fs.copyFileSync(path.join(OUT, "上传顺序.txt"), path.join(desk, "上传顺序.txt"));
  console.log("desktop", desk);
}
