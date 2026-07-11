import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "住宅窗膜百科",
  description: "一窗住宅窗膜知识库，持续更新天津窗膜、天津玻璃膜、天津住宅窗膜、天津隔热膜、天津隐私膜、天津建筑膜和家庭贴膜常见问题。",
  path: "/articles"
});

type ArticlesPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

const articleCategories = [
  {
    title: "窗膜基础知识",
    description: "从材料、适用玻璃、施工方式和日常使用开始，帮你先把住宅窗膜看明白。"
  },
  {
    title: "隔热专区",
    description: "重点聊西晒、落地窗、阳光房、采光和家具防晒这些家里最常见的问题。"
  },
  {
    title: "隐私专区",
    description: "解释白天防窥、夜晚开灯、低楼层隐私和窗帘配合等真实使用差异。"
  },
  {
    title: "真实案例",
    description: "记录不同户型、不同朝向、不同玻璃条件下的住宅窗膜处理思路。"
  },
  {
    title: "实验室",
    description: "用更直观的方式对比隔热、透光、反光和隐私效果，少一点猜测。"
  },
  {
    title: "常见问题",
    description: "集中回答价格、测量、施工时间、异味、质保和天津上门服务等问题。"
  }
];

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const activeCategory = params?.category;
  const allArticles = getAllArticles();
  const articles = activeCategory ? getArticlesByCategory(activeCategory) : [];

  return (
    <>
      <PageHero
        eyebrow="WINDOW FILM ENCYCLOPEDIA"
        title="住宅窗膜百科"
        description="围绕天津家庭常见的西晒、隐私、采光、家具防晒和贴膜安全问题，持续发布天津窗膜、天津玻璃膜、天津住宅窗膜、天津隔热膜、天津隐私膜和天津建筑膜相关内容。"
      />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articleCategories.map((category) => {
            const count = allArticles.filter((article) => article.category === category.title).length;

            return (
              <Link
                key={category.title}
                href={`/articles?category=${encodeURIComponent(category.title)}`}
                className="focus-ring rounded-lg border border-line/70 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue hover:shadow-soft"
              >
                <p className="text-sm font-medium tracking-[0.18em] text-blue">CATEGORY</p>
                <h2 className="mt-4 text-2xl font-medium">{category.title}</h2>
                <p className="mt-4 min-h-16 leading-7 text-ink/66">{category.description}</p>
                <p className="mt-6 text-sm text-ink/45">{count}篇</p>
              </Link>
            );
          })}
        </div>

        {activeCategory ? (
          <div className="mt-14">
            <div className="flex flex-col justify-between gap-4 border-t border-line/70 pt-10 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium tracking-[0.18em] text-blue">ARTICLES</p>
                <h2 className="mt-3 text-3xl font-medium">{activeCategory}</h2>
              </div>
              <Link href="/articles" className="focus-ring rounded-full border border-line px-5 py-2 text-sm text-ink/72 transition hover:border-blue hover:text-ink">
                返回全部分类
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="focus-ring rounded-lg border border-line/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="mb-5 rounded-md bg-paper p-2">
                    <Image
                      src={article.cover}
                      alt={article.title}
                      width={610}
                      height={305}
                      className="aspect-[2/1] w-full rounded object-cover"
                    />
                  </div>
                  <p className="text-sm text-blue">{article.category} · {article.readingTime}</p>
                  <h3 className="mt-3 text-xl font-medium leading-8">{article.title}</h3>
                  <p className="mt-3 line-clamp-3 leading-7 text-ink/66">{article.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
