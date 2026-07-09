import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/cases", "/articles", "/faq", "/contact"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8
  }));

  const articleRoutes = getAllArticles().map((article) => ({
    url: `${site.url}/articles/${article.slug}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...routes, ...articleRoutes];
}
