import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getArticleFaqs,
  getRelatedArticles
} from "@/lib/articles";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = getArticleBySlug(slug);
    return {
      title: {
        absolute: `${article.title}｜住宅窗膜知识中心｜一窗生活科技`
      },
      description: article.description,
      keywords: article.keywords,
      authors: [{ name: article.author }],
      alternates: {
        canonical: `/articles/${article.slug}`
      },
      openGraph: {
        title: `${article.title}｜住宅窗膜知识中心`,
        description: article.description,
        type: "article",
        url: `${site.url}/articles/${article.slug}`
      }
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article;

  try {
    article = getArticleBySlug(slug);
  } catch {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: site.company
    },
    keywords: article.tags.join(", "),
    articleSection: article.category,
    mainEntityOfPage: `${site.url}/articles/${article.slug}`
  };
  const faqs = getArticleFaqs(article);
  const relatedArticles = getRelatedArticles(article.slug, 3);
  const moreArticles = getAllArticles()
    .filter((item) => item.slug !== article.slug && !relatedArticles.some((related) => related.slug === item.slug))
    .slice(0, 3);
  const { previous, next } = getAdjacentArticles(article.slug);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <article className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container-page py-10 md:py-14">
        <nav className="text-sm text-ink/52" aria-label="面包屑导航">
          <Link href="/" className="hover:text-ink">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/articles" className="hover:text-ink">知识中心</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/72">{article.category}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <p className="text-sm text-blue">{article.category} · {article.publishDate} · {article.readingTime}</p>
            <h1 className="mt-4 text-3xl font-medium leading-tight md:text-5xl">{article.title}</h1>
            <p className="mt-5 text-lg leading-8 text-ink/68">{article.description}</p>

            <div className="prose prose-slate mt-10 max-w-none prose-headings:text-ink prose-p:text-ink/72 prose-a:text-blue">
              <MDXRemote source={article.content} components={mdxComponents} />
            </div>

            <section className="mt-14 border-t border-line/70 pt-10">
              <h2 className="text-2xl font-medium">常见问题</h2>
              <div className="mt-5 space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="rounded-lg border border-line/70 bg-paper p-5">
                    <summary className="cursor-pointer font-medium text-ink">{faq.question}</summary>
                    <p className="mt-3 leading-7 text-ink/66">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <nav className="mt-10 grid gap-4 border-t border-line/70 pt-8 md:grid-cols-2" aria-label="上一篇和下一篇">
              {previous ? (
                <Link href={`/articles/${previous.slug}`} className="focus-ring rounded-lg border border-line/70 bg-white p-5 transition hover:border-blue">
                  <p className="text-sm text-ink/45">上一篇</p>
                  <p className="mt-2 font-medium leading-7">{previous.title}</p>
                </Link>
              ) : (
                <div className="rounded-lg border border-line/60 bg-paper p-5 text-sm text-ink/45">已经是最新文章</div>
              )}
              {next ? (
                <Link href={`/articles/${next.slug}`} className="focus-ring rounded-lg border border-line/70 bg-white p-5 transition hover:border-blue md:text-right">
                  <p className="text-sm text-ink/45">下一篇</p>
                  <p className="mt-2 font-medium leading-7">{next.title}</p>
                </Link>
              ) : (
                <div className="rounded-lg border border-line/60 bg-paper p-5 text-sm text-ink/45 md:text-right">已经是最后一篇</div>
              )}
            </nav>
          </div>

          <aside className="space-y-6">
            {article.toc.length > 0 ? (
              <nav className="rounded-lg border border-line/70 bg-white p-6" aria-label="文章目录">
                <h2 className="text-lg font-medium">目录</h2>
                <div className="mt-4 space-y-3 text-sm">
                  {article.toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block leading-6 text-ink/62 hover:text-ink ${item.level === 3 ? "pl-4" : ""}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </nav>
            ) : null}

            <div className="rounded-lg border border-line/70 bg-paper p-6">
              <p className="text-sm font-medium tracking-[0.18em] text-blue">ARTICLE INFO</p>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-ink/45">分类</dt>
                  <dd className="mt-1 text-ink">{article.category}</dd>
                </div>
                <div>
                  <dt className="text-ink/45">阅读时间</dt>
                  <dd className="mt-1 text-ink">{article.readingTime}</dd>
                </div>
                <div>
                  <dt className="text-ink/45">关键词</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {article.tags.map((keyword) => (
                      <span key={keyword} className="rounded-full border border-line bg-white px-3 py-1 text-ink/62">
                        {keyword}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <RelatedList title="相关推荐" articles={relatedArticles} />
            <RelatedList title="相关文章" articles={moreArticles} />
          </aside>
        </div>
      </div>
    </article>
  );
}

const mdxComponents = {
  YouTube
};

function YouTube({ id }: { id: string }) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-line/70 bg-paper">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function RelatedList({
  title,
  articles
}: {
  title: string;
  articles: ReturnType<typeof getAllArticles>;
}) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-line/70 bg-white p-6">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-4 space-y-4">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="block border-b border-line/70 pb-4 last:border-0 last:pb-0">
            <p className="text-sm text-blue">{article.category} · {article.readingTime}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-ink">{article.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
