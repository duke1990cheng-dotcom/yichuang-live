import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getArticleCategories, getArticleTags, getArticlesByCategory, getArticlesByTag } from "@/lib/articles";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "住宅窗膜知识中心",
  description: "一窗住宅窗膜知识库，持续更新天津窗膜、天津玻璃膜、天津住宅窗膜、天津隔热膜、天津隐私膜、天津建筑膜和家庭贴膜常见问题。",
  path: "/articles"
});

type ArticlesPageProps = {
  searchParams?: Promise<{ category?: string; tag?: string }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const activeCategory = params?.category ?? "全部";
  const activeTag = params?.tag;
  const categories = ["全部", ...getArticleCategories()];
  const tags = getArticleTags();
  const articles = activeTag ? getArticlesByTag(activeTag) : getArticlesByCategory(activeCategory);

  return (
    <>
      <PageHero
        eyebrow="KNOWLEDGE CENTER"
        title="住宅窗膜知识中心"
        description="围绕天津家庭常见的西晒、隐私、采光、家具防晒和贴膜安全问题，持续发布天津窗膜、天津玻璃膜、天津住宅窗膜、天津隔热膜、天津隐私膜和天津建筑膜相关内容。"
      />
      <section className="container-page py-10 md:py-14">
        <nav className="flex flex-wrap gap-2" aria-label="文章分类">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            const href = category === "全部" ? "/articles" : `/articles?category=${encodeURIComponent(category)}`;

            return (
              <Link
                key={category}
                href={href}
                className={`focus-ring rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink/68 hover:border-blue hover:text-ink"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="文章标签">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              className={`focus-ring rounded-full border px-3 py-1.5 text-sm transition ${
                activeTag === tag
                  ? "border-blue bg-blue/10 text-ink"
                  : "border-line bg-white text-ink/58 hover:border-blue hover:text-ink"
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="focus-ring rounded-lg border border-line/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <p className="text-sm text-blue">{article.category} · {article.readingTime}</p>
              <h2 className="mt-3 text-xl font-medium leading-8">{article.title}</h2>
              <p className="mt-3 line-clamp-3 leading-7 text-ink/66">{article.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-paper px-3 py-1 text-xs text-ink/52">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm text-ink/45">{article.publishDate}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
