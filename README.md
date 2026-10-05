# ZiruPDF website — GitHub + Cloudflare Pages

这是 ZiruPDF 官网的纯静态网站包，不需要 Node.js，也不需要构建步骤。

## 1. 新建 GitHub 仓库

建议仓库名：`ZiruPDF` 

将本目录中的所有文件和文件夹上传到仓库根目录，并使用 `main` 分支。

> 这个 GitHub 仓库只用于网站和公开 Release。ZiruPDF 应用源码不应上传到公开仓库。

## 2. 网站配置

网站下载链接位于：

`assets/js/config.js`

当前默认配置：

```js
githubRepo: "sugkp112/ZiruPDF",
latestVersion: "2.0.36",
downloadAsset: "ZiruPDF_Setup_2.0.36.exe",
customDomain: "zirupdf.zirulab.org"
```

如果 GitHub 用户名、版本号或安装包文件名发生变化，只修改这里即可。

## 3. 新建 Cloudflare Pages 项目

在 Cloudflare：

**Workers 和 Pages → 创建 → Pages → 连接到 Git**

选择刚建立的 GitHub 仓库 `ZiruPDF`。

推荐设置：

- Project name: `zirupdf`
- Production branch: `main`
- Framework preset: `None`
- Build command: 留空
- Build output directory: `.`

部署完成后，Cloudflare 会生成：

`https://zirupdf.pages.dev`

## 4. 绑定正式域名

Cloudflare Pages 项目中进入：

**Custom domains / 自定义域 → Set up a custom domain**

添加：

`zirupdf.zirulab.org`

正式网站地址：

`https://zirupdf.zirulab.org/`

本包的 `CNAME` 文件也已经更新为 `zirupdf.zirulab.org`，主要用于域名信息留档；Cloudflare Pages 实际绑定以 Pages 项目的 Custom domains 设置为准。

## 5. DNS

如果 Cloudflare 自动创建 DNS，接受它给出的 Pages CNAME 即可。

典型记录类似：

- Type: CNAME
- Name: `zirupdf`
- Target: `zirupdf.pages.dev`
- Proxy: Proxied（橙云）

不要修改 `zirulab.org` 的 MX / SPF / DKIM 邮件记录。

## 6. 发布 Windows 安装包

在 GitHub 仓库中创建 Release，例如：

Tag: `v2.0.36`

上传：

`ZiruPDF_Setup_2.0.36.exe`

网站下载按钮会自动指向：

`https://github.com/sugkp112/ZiruPDF/releases/latest/download/ZiruPDF_Setup_2.0.36.exe`

如果下一版变成 2.0.37，只需更新 `assets/js/config.js` 中的版本号和安装包文件名。

## 7. 旧 FreeDoc 网站

新的正式网站稳定后，可以：

- 删除旧 Pages 项目的 `freedoc.zirulab.org` 自定义域；或
- 为 `freedoc.zirulab.org` 建立 301 重定向到 `https://zirupdf.zirulab.org`。

如果旧网址已经对外使用过，推荐保留 301 重定向。

## 8. 正式发布前

1. 在干净 Windows 10 / 11 电脑验证安装、启动与卸载。
2. 验证 PDF、OCR、Office 转换和打印。
3. 检查最终安装目录中的第三方许可证。
4. 确认下载按钮能正确取得 GitHub Release 中的 EXE。
5. 有条件时为 Windows EXE / Installer 做代码签名。


## 赞助页面

`/sponsor.html` 为 ZiruPDF 官方自愿赞助说明页。当前未配置支付渠道时，页面只显示说明；后续请仅在此页加入官方赞助方式。
