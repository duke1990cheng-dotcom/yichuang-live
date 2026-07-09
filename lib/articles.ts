import {
  getAdjacentContent,
  getAllContent,
  getContentByCategory,
  getContentBySlug,
  getContentCategories,
  getContentTags,
  getContentByTag,
  getRelatedContent,
  type ContentItem
} from "@/lib/content";
import { site } from "@/lib/site";

export type Article = ContentItem & {
  date: string;
  keywords: string[];
};

function asArticle(item: ContentItem): Article {
  return {
    ...item,
    date: item.publishDate,
    keywords: item.tags
  };
}

export function getArticleSlugs() {
  return getAllContent("articles").map((article) => article.slug);
}

export function getArticleBySlug(slug: string): Article {
  return asArticle(getContentBySlug("articles", slug));
}

export function getAllArticles() {
  return getAllContent("articles").map(asArticle);
}

export function getArticleCategories() {
  return getContentCategories("articles");
}

export function getArticleTags() {
  return getContentTags("articles");
}

export function getArticlesByCategory(category?: string) {
  return getContentByCategory("articles", category).map(asArticle);
}

export function getArticlesByTag(tag?: string) {
  return getContentByTag("articles", tag).map(asArticle);
}

export function getAdjacentArticles(slug: string) {
  const adjacent = getAdjacentContent("articles", slug);

  return {
    previous: adjacent.previous ? asArticle(adjacent.previous) : null,
    next: adjacent.next ? asArticle(adjacent.next) : null
  };
}

export function getRelatedArticles(slug: string, limit = 3) {
  return getRelatedContent("articles", slug, limit).map(asArticle);
}

export function getArticleFaqs(article: Article) {
  return [
    {
      question: `这篇文章适合哪些家庭参考？`,
      answer: `适合正在关注${article.category}、隔热、隐私、采光、家具防晒或天津住宅窗膜安装的家庭参考。`
    },
    {
      question: "只看文章就能确定最终窗膜方案吗？",
      answer: "文章可以帮助理解选择逻辑，但最终仍建议结合窗户朝向、玻璃类型、楼层、采光和现场测量来判断。"
    },
    {
      question: "一窗是否提供上门测量和施工？",
      answer: `一窗提供住宅窗膜上门测量、方案报价和专业安装服务，也可以到${site.address}看样膜和咨询。`
    }
  ];
}
