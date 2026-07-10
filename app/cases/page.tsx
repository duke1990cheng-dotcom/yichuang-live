import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/card";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "案例中心",
  description: "一窗案例中心展示天津住宅窗膜、隔热膜、隐私膜、阳台落地窗和西晒房间常见处理方式。",
  path: "/cases"
});

const cases = [
  ["西晒客厅隔热方案", "针对客厅下午西晒、玻璃附近热感明显的问题，优先考虑低反光住宅隔热膜，兼顾采光和舒适度。", "/images/home-hero-living.webp"],
  ["落地窗隐私方案", "针对大面积落地窗、楼间距较近或临街视线问题，配置白天隐私膜并建议夜间配合窗帘。", "/images/bedroom-window.webp"],
  ["阳光房隔热方案", "针对阳光房夏季闷热、强光和家具暴晒问题，结合顶面与侧面玻璃情况选择隔热方案。", "/images/sunroom-window.webp"]
];

export default function CasesPage() {
  return (
    <>
      <PageHero
        eyebrow="CASES"
        title="案例中心"
        description="这里整理了天津家庭常见的窗膜需求：西晒客厅、落地窗隐私、阳光房隔热。实际施工前，我们会根据玻璃面积、朝向和采光情况再做判断。"
      />
      <section className="container-page grid gap-5 py-14 md:grid-cols-3">
        {cases.map(([title, text, image]) => (
          <Card key={title}>
            <div className="mb-5 rounded-md bg-paper p-2">
              <Image
                src={image}
                alt={title}
                width={610}
                height={305}
                className="aspect-[4/3] w-full rounded object-cover"
              />
            </div>
            <h2 className="text-xl font-medium">{title}</h2>
            <p className="mt-3 leading-7 text-ink/68">{text}</p>
            <p className="mt-5 text-sm text-blue">支持上门测量后确认适合的膜材</p>
          </Card>
        ))}
      </section>
    </>
  );
}
