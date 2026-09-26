# 已经做过的，只作对照

不要把店名、香钟、体修、课表句子抄进新应用。只抄壳、签名和商店栏的填法。

| 他嘴上说的 | 目录 | 包名 | 第一屏该是什么 |
|---|---|---|---|
| 下节课、大学生课表 | `D:\APP\kejian` | `com.qisaijun.xiajieke.hmos` | 打开就看到下一节课。底栏是浮起的圆角条 |
| 课时、水印相机 | `D:\APP\keshi` | `com.qisaijun.keshi.hmos` | 打开就能拍、能看课时 |
| 月信、月经记录 | `D:\APP\yuexin` | `com.qisaijun.yuexin.hmos` | 打开就看到这次记录。不写疗效 |
| 锻体、断体 | `D:\APP\zhugu` | `com.duanti.app.hmos` | 打开就看到今天这练。证书在这里 |
| 想吃先停 | `D:\APP\changui` | `com.xiangchi.xianting.hmos` | 演示点单。不真扣款、不真出餐 |
| 正确时刻 | `D:\APP\zhengque-shike` | `com.zhengque.shike.hmos` | 专注计时。分类只选效率 / 专注 |
| 场记 | `D:\APP\changji` | `com.changji.app.hmos` | 打开就进这一场拍摄 |
| 领宠 | `D:\APP\lingchong` | `com.lingchong.app.hmos` | 新用户看见宠物在走。列表只在「全部习惯」 |
| 边译 | `D:\APP\bianyi` | `com.qisaijun.bianyi.hmos` | 屏幕边上的翻译，不自动发消息 |
| 楚汉 | `D:\APP\chuhan` | `com.qisaijun.chuhan.hmos` | 本地棋局 |

隐私页仓库都在 `BigQ749/<名字>-privacy`，例如 `lingchong-privacy`、`duanti-privacy`、`yuexin-privacy`、`keshi-privacy`、`xiajieke-privacy`。

## 各家踩坑，新应用禁止再犯

- 包名和 AGC 差一个 `.hmos`：工程改成 AGC 那一个。
- `type=module` 或脚本写在 `#root` 前面：白屏。
- 没清 `MessageChannel`：白屏，模拟器、云测、真机一样。
- 关掉 `onlineImageAccess`：图全没。
- 未签名就上传：992。
- 截图 1080×2340：后台要 1080×1920。
- 截图前没写入演示数据：十张都是空欢迎页。
- 包里还有 INTERNET：不能选单机。删掉后要重签。
- 图标预圆角，或和包内图标不是同一张：驳回。
- 介绍里夹「审核对照」、假电话：驳回。
- 鸿蒙包拿去测鸿蒙 2/3/4：启动失败，不是程序坏了。
- 安卓若要做：另一个应用、另一个包名、`file:///android_asset/www/index.html`。不要用 `.huawei` 结尾。
