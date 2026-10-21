> 2026-10-21：本文是历史实现参考。当前发布/自检规则见 [交付契约](references/release-contract.md) 和 [AGC 草稿流程](references/agc-drafts.md)，权限/政策见 [隐私与权限](references/privacy-permissions.md)。固定尺寸、固定 API/盘符、单机无权限、两份协议必建和不做云测等旧假设不得覆盖实际产品与当前要求。

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
// 默认保留 MessageChannel；仅经目标 ArkWeb 复现调度故障后，在专用构建中有界启用回退。
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

不要无条件删除 `MessageChannel`。先记录目标 OS、ArkWeb、框架版本并复现回调/调度错误；只有确认此机制导致启动失败，才在该目标构建、业务脚本之前使用有条件的兼容回退并验证副作用。其他消息桥或库可能依赖它。  
脚本若放在 `head` 里又去掉 `type="module"`，`#root` 还不存在，也会白屏。

页面跑起来后给 `#root` 写上 `dataset.ok = "1"`，避免后来的小错误把整页换成报错字。

## ArkWeb

- 仅按实际用途开启脚本、存储和图片等能力；逐项核对当前 SDK 开关语义，不统一打开文件、数据库、网络图片和混合内容。
- `onlineImageAccess` 控制网络图片，不把包内/data 图片故障一律归因为它；检查真实来源、资源路径和解码失败，按当前 SDK 文档及目标设备验证。
- 全屏，状态栏颜色跟纸色 `#F7F6F3`，字色 `#161815`。
- 把系统上沿、下沿写成 `--sat`、`--sab`。
- 本地资源按当前 ArkWeb 官方支持的来源和资源拦截方案加载；桥接限定本应用可信来源。不得通过 `onSslErrorEvent.handleConfirm()` 忽略证书错误来营造安全上下文；旧 origin 迁移需保护 IndexedDB 等数据。

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
