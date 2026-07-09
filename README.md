# 一窗生活科技官网 V1

基于 Next.js + Tailwind CSS 的内容型官网，适合展示品牌、发布住宅窗膜知识文章，并支持静态生成、SEO、sitemap 和 robots。

## 本地运行

```bash
npm install
npm run dev
```

如果使用 pnpm：

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 构建

```bash
npm run build
npm run start
```

pnpm 对应命令：

```bash
pnpm build
pnpm start
```

## 发布新文章

在 `content/articles` 下新增 `.mdx` 或 `.md` 文件，例如：

```md
---
title: "天津住宅窗膜怎么选？"
description: "介绍天津家庭选择住宅玻璃膜、隔热膜、隐私膜时需要关注的重点。"
date: "2026-07-09"
category: "住宅窗膜知识"
keywords:
  - 天津住宅窗膜
  - 玻璃膜
readingTime: "约4分钟"
---

正文内容从这里开始。
```

文件名会成为文章 URL，例如 `content/articles/tianjin-window-film-guide.mdx` 会生成 `/articles/tianjin-window-film-guide`。

## 页面结构

- `/` 首页
- `/about` 关于一窗
- `/services` 服务项目
- `/cases` 案例中心
- `/articles` 知识文章
- `/articles/[slug]` 文章详情
- `/faq` 常见问题
- `/contact` 联系我们

## SEO

- 每个页面已设置 `title` 和 `description`
- `app/sitemap.ts` 自动生成 `/sitemap.xml`
- `app/robots.ts` 自动生成 `/robots.txt`
- 文章详情页支持静态生成和 Article JSON-LD
- 路径使用英文，文章标题和页面内容使用中文，适合百度 SEO 与 AI GEO 收录

## 部署到 Vercel

1. 将项目推送到 GitHub / GitLab / Bitbucket。
2. 在 Vercel 新建项目并导入仓库。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用 `npm run build`。
5. Output Directory 保持默认。
6. 部署完成后，将 `lib/site.ts` 中的 `url` 替换为正式域名。
