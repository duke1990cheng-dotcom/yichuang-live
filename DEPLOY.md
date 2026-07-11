# Deploy to Vercel

## 项目说明

这是一个 Next.js 网站项目，适合部署到 Vercel。

项目根目录：

```text
/Users/duke/Documents/YICHUANG Brand
```

## 部署前检查

在项目根目录运行：

```bash
npm run build
```

如果构建通过，说明网站可以部署。

## Vercel 部署步骤

1. 打开 Vercel：

```text
https://vercel.com
```

2. 登录账号。

3. 点击 `Add New...`，选择 `Project`。

4. 导入当前项目对应的 Git 仓库。

5. Vercel 通常会自动识别为 Next.js 项目。

推荐配置：

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

6. 点击 `Deploy`。

## 域名设置

部署完成后，在 Vercel 项目中进入：

```text
Settings → Domains
```

添加正式域名，例如：

```text
www.yichuang.live
```

域名解析按 Vercel 提示设置即可。

## 上线后检查

上线后请检查以下地址：

```text
/
/about
/services
/cases
/articles
/faq
/contact
/sitemap.xml
/robots.txt
```

重点确认：

- 页面能打开
- 首页按钮能跳转
- sitemap.xml 能访问
- robots.txt 指向 sitemap.xml
- 手机端显示正常

## 联系方式

```text
电话：18500353137
微信：18500353137
地址：天津市红桥区红旗路一号红星美凯龙一楼一窗窗膜体验中心
```

## 百度主动提交

项目已提供百度普通收录提交脚本：

```bash
npm run submit:baidu
```

脚本会读取网站 `/sitemap.xml` 里的链接，并提交到百度搜索资源平台。

需要先准备两个环境变量：

```text
BAIDU_SITE=https://www.yichuang.live
BAIDU_TOKEN=你的百度普通收录 token
```

获取 Token：

1. 打开百度搜索资源平台：https://ziyuan.baidu.com
2. 添加并验证网站 `www.yichuang.live`
3. 进入“资源提交”或“普通收录”
4. 复制接口调用地址里的 `token`

在 Vercel 配置：

```text
Project Settings → Environment Variables
```

添加：

```text
BAIDU_SITE
BAIDU_TOKEN
```

本地手动执行示例：

```bash
BAIDU_SITE=https://www.yichuang.live BAIDU_TOKEN=你的token npm run submit:baidu
```

Token 不要写进代码或提交到 GitHub。
