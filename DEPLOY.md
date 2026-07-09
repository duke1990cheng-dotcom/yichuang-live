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
www.yichuanglife.com
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
