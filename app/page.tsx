import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { images } from "@/lib/site-images";

export const metadata: Metadata = createPageMetadata({
  title: "一窗生活科技｜天津住宅窗膜隔热膜隐私膜服务",
  description:
    "一窗生活科技专注天津住宅玻璃膜、隔热膜、隐私膜、建筑膜服务，提供上门测量、方案报价和专业安装。",
  path: "/"
});

const values = [
  {
    title: "隔热",
    text: "降低西晒和大面积玻璃带来的热感，让客厅、阳台、卧室更舒适。",
    detail: "适合西晒房、落地窗和大面积玻璃空间。"
  },
  {
    title: "隐私",
    text: "根据楼间距、朝向和使用场景，选择适合家庭的隐私膜方案。",
    detail: "兼顾采光、视线遮挡与日常居住安全感。"
  },
  {
    title: "节能",
    text: "减少空调负荷和家具日晒老化，帮助家庭获得长期居住价值。",
    detail: "减少夏季空调压力，也延缓软装家具日晒褪色。"
  }
];

const process = ["咨询", "上门测量", "方案报价", "专业施工", "售后保障"];
const tags = ["隔热", "隐私", "节能"];

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.company,
    alternateName: site.brand,
    url: site.url,
    description:
      "一窗提供天津住宅窗膜、隔热膜、隐私膜、建筑膜、上门测量和上门安装服务。",
    areaServed: "天津",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "天津",
      addressCountry: "CN"
    },
    telephone: site.phone,
    makesOffer: [
      "天津住宅窗膜",
      "隔热膜",
      "隐私膜",
      "建筑膜",
      "上门测量",
      "上门安装"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <section className="bg-white">
        <div className="container-page grid min-h-[540px] items-center gap-10 py-12 lg:grid-cols-[1.03fr_0.97fr] lg:py-14">
          <div>
            <h1 className="text-4xl font-medium leading-tight text-ink md:text-6xl">
              专业住宅窗膜服务
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70 md:text-xl">
              隔热、隐私、节能，提升居住品质
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="focus-ring rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-ink/88"
              >
                预约上门测量
              </Link>
              <Link
                href="/articles"
                className="focus-ring rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-ink transition hover:border-blue"
              >
                了解窗膜知识
              </Link>
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-ink/58">
              天津红星美凯龙一楼体验中心｜提供上门测量与安装服务｜住宅窗膜方案咨询
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/48">
              服务方向包括天津窗膜、天津玻璃膜、天津住宅窗膜、天津隔热膜、天津隐私膜与天津建筑膜咨询。
            </p>
          </div>
          <div className="rounded-lg border border-line/80 bg-paper px-7 py-8 shadow-soft">
            <div className="rounded-lg border border-line/70 bg-white/72 p-6">
              <div className="mx-auto max-w-sm overflow-hidden rounded-md border border-line/80 bg-white">
                <Image
                  src={images.homeHeroImage}
                  alt="一窗窗膜体验中心"
                  width={1086}
                  height={510}
                  priority
                  className="aspect-[1086/510] w-full object-cover"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-2xl font-medium tracking-wide text-ink">一窗窗膜体验中心</p>
                <p className="mt-3 text-base leading-7 text-ink/62">天津市红桥区红旗路一号红星美凯龙一楼</p>
                <div className="mt-5 flex justify-center gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-ink/70">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-ink/58">欢迎到店体验不同窗膜的隔热、隐私与采光效果，也可以预约上门测量。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line/60 bg-paper py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.2em] text-blue">WHY WINDOW FILM</p>
            <h2 className="mt-3 text-3xl font-medium">为什么选择住宅窗膜</h2>
            <p className="mt-4 leading-8 text-ink/66">
              在不改变住宅结构的前提下，改善玻璃带来的热、晒、隐私和舒适度问题。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="mt-8 rounded-lg border border-line/70 bg-white p-7">
                <h2 className="text-2xl font-medium">{value.title}</h2>
                <p className="mt-4 leading-7 text-ink/68">{value.text}</p>
                <p className="mt-4 text-sm leading-6 text-ink/52">{value.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.2em] text-blue">SERVICE PROCESS</p>
            <h2 className="mt-3 text-3xl font-medium">一窗服务流程</h2>
            <p className="mt-4 leading-8 text-ink/66">
              从家庭实际场景出发，先测量再给方案，避免只按产品参数做选择。
            </p>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {process.map((item, index) => (
              <div key={item} className="rounded-lg border border-line/70 bg-paper p-5">
                <span className="text-sm text-blue">0{index + 1}</span>
                <p className="mt-3 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line/60 bg-paper py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-blue">EXPERIENCE CENTER</p>
            <h2 className="mt-3 text-3xl font-medium">一窗住宅窗膜体验中心</h2>
          </div>
          <div>
            <div className="mb-6 max-w-xl rounded-lg border border-line/70 bg-white p-2">
              <Image
                src={images.homeExperienceImage}
                alt="一窗窗膜体验中心门店"
                width={970}
                height={454}
                className="aspect-[4/2.35] w-full rounded-md object-cover"
              />
            </div>
            <p className="text-lg leading-9 text-ink/70">
              位于天津市红桥区红旗路一号红星美凯龙一楼，提供真实窗膜体验、产品对比、方案咨询与施工预约。家里有西晒、落地窗太热、阳光房闷热或白天隐私不够，都可以先到店看样膜，也可以预约上门测量。
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-blue">KNOWLEDGE BASE</p>
            <h2 className="mt-3 text-3xl font-medium">住宅窗膜知识库</h2>
          </div>
          <Link href="/articles" className="focus-ring rounded-full border border-line px-5 py-2 text-sm text-ink/72 transition hover:border-blue hover:text-ink">
            查看全部文章
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="focus-ring mt-8 block rounded-lg border border-line/70 bg-white p-6 transition hover:border-blue"
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
              <p className="text-sm text-blue">{article.category}</p>
              <h3 className="mt-3 text-lg font-medium leading-7">{article.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/62">{article.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line/60 bg-paper py-16">
        <div className="container-page">
          <h2 className="text-3xl font-medium">联系方式</h2>
          <div className="mt-7 rounded-lg border border-line/70 bg-white p-7 text-base leading-8 text-ink/72">
            <p>天津一窗生活科技有限公司</p>
            <p>{site.address}</p>
            <p>电话：{site.phone}</p>
            <p>微信：{site.wechat}</p>
          </div>
        </div>
      </section>
    </>
  );
}
