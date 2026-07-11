import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { images } from "@/lib/site-images";

export const metadata: Metadata = createPageMetadata({
  title: "住宅窗膜应用场景",
  description: "一窗整理西晒客厅、落地窗、阳光房、隐私改善等常见住宅窗膜应用场景，帮助用户了解不同需求适合的窗膜方案。",
  path: "/cases"
});

const scenes = [
  ["西晒客厅", "下午阳光直射、玻璃附近热感明显，通常优先关注隔热、眩光和家具防晒。", images.cases.westFacingLivingRoom],
  ["落地窗隐私", "大面积玻璃、楼间距较近或临街视线明显，可以重点比较白天隐私和采光变化。", images.cases.floorToCeilingPrivacy],
  ["阳光房隔热", "顶部和侧面玻璃面积较大，夏季容易闷热，需要结合朝向、通风和玻璃面积判断。", images.cases.sunroomHeat]
];

export default function CasesPage() {
  return (
    <>
      <PageHero
        eyebrow="APPLICATIONS"
        title="住宅窗膜应用场景"
        description="我们会持续整理西晒客厅、落地窗、阳光房、隐私改善等常见住宅窗膜应用场景，帮助用户了解不同需求适合什么样的窗膜方案。"
      />
      <section className="container-page py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-medium">常见家庭需求</h2>
            <p className="mt-5 leading-8 text-ink/68">
              住宅窗膜不是只看产品参数，更要看家里的朝向、楼层、玻璃面积、采光和日常使用习惯。正式施工前，一窗会通过上门测量和样膜沟通，判断更适合隔热、隐私、防晒，还是多种需求一起考虑。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {scenes.map(([title, text, image]) => (
              <div key={title} className="rounded-lg border border-line/70 bg-white p-5 shadow-sm">
                <div className="mb-5 rounded-md bg-paper p-2">
                  <Image
                    src={image}
                    alt={title}
                    width={610}
                    height={305}
                    className="aspect-[4/3] w-full rounded object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/66">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
