# 壳：怎么才不会白屏、卡死、画不出

锻体、领宠、下节课已经踩过。新应用直接抄，不要再试模块脚本。

## 网页包

Vite：`base: "./"`，一条 IIFE，`app.js` + `app.css`，不要代码分割。

rawfile 里的 `index.html` 必须长这样（脚本在 `#root` 后面）：

```html
<!doctype html>
<html lang="zh-CN" data-skin="harmony">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>产品名</title>
<link rel="stylesheet" href="./app.css"/>
</head>
<body>
<div id="root">正在打开…</div>
<script>
window.MessageChannel = undefined;
window.addEventListener("error", function (e) {
  var el = document.getElementById("root");
  if (!el || el.dataset.ok) return;
  el.textContent = "页面卡住了：" + (e.message || e.error || e);
});
</script>
<script src="./app.js"></script>
</body>
</html>
```

`MessageChannel` 必须在 `app.js` 之前清掉。鸿蒙浏览器里它不回调，React 会永远停在白屏。  
脚本若放在 `head` 里又去掉 `type="module"`，`#root` 还不存在，也会白屏。

页面跑起来后给 `#root` 写上 `dataset.ok = "1"`，避免后来的小错误把整页换成报错字。

## ArkWeb

- `javaScriptAccess`、`domStorageAccess`、`fileAccess`、`imageAccess`、`databaseAccess` 开。
- **不要** `onlineImageAccess(false)`。关掉后连 data 图和包内图一起没。
- 全屏，状态栏颜色跟纸色 `#F7F6F3`，字色 `#161815`。
- 把系统上沿、下沿写成 `--sat`、`--sab`。
- 本地模型、大文件不要用 `fetch('resource://...')`。改请求 `https://<产品>.local/...`，在 `onInterceptRequest` 里用 `getRawFileContentSync` 把字节塞回去，并 `onSslErrorEvent` 只放行这个域名。

## 画面画不出（只剩一块底色）

模拟器的 GL 会把视口偷偷改成 0，Three 以为已经设过，就不再设。每帧画之前：

```js
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
```

鸿蒙壳里：抗锯齿关掉，像素比锁 1，不要 `preserveDrawingBuffer`（会卡）。大约 30 帧就够，模拟器会顺很多。

## 底栏

真机壳用浮条，不要通栏贴底：

```css
html[data-skin="harmony"] .tabs {
  margin: 8px 0 22px;
  padding: 8px 6px;
  border: 1px solid rgba(22, 24, 21, 0.1);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(22, 24, 21, 0.06);
}
```

下节课的参考是 `.dock`：左右 10px，底下 `8px + --sab`，圆角 18。领宠用 22px 底边，横杠能露出来。他再说高了或低了，只改这一处间距，不要改整页。

## 新用户

没有记录时，第一页就是主场景（宠物在走、课表、记录），不是「还没有内容」的管理页。  
管理页只在他点「全部习惯」这类按钮之后出现。从管理页再进「新建」。没有记录时，新建页不要放「返回」把人送回空列表。

## 编译

```text
set DEVECO_SDK_HOME=E:\APP\DevEco Studio\sdk
hvigorw.bat --mode project -p product=default -p buildMode=release assembleApp --no-daemon
```

签名链必须是叶子证书在前，再上级，再根。反了会报证书链对不上。`-inForm zip`。成功后桌面文件名用中文产品名加「上传包.app」。
