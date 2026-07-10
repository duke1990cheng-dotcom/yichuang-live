import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/card";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "关于一窗",
  description: "了解天津一窗生活科技有限公司，一窗是专注天津住宅窗膜、隔热膜、隐私膜和建筑膜的专业服务品牌。",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT"
        title="关于一窗"
        description="天津一窗生活科技有限公司旗下品牌一窗，定位为专业住宅窗膜服务品牌，围绕天津家庭的隔热、隐私、节能和居住品质改善提供服务。"
      />
      <section className="container-page py-14">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-medium">天津一窗生活科技有限公司</h2>
          <p className="mt-4 leading-8 text-ink/68">
            一窗专注天津住宅窗膜、天津玻璃膜、天津隔热膜、天津隐私膜和天津建筑膜服务。
            我们希望用清晰的产品说明、上门测量和规范安装，帮助家庭更稳妥地改善西晒、隐私、采光和家具防晒问题。
          </p>
        </div>
        <div className="mt-8 max-w-4xl rounded-lg border border-line/70 bg-paper p-3">
          <Image
            src="/images/lounge-window.webp"
            alt="一窗住宅窗膜休息洽谈空间"
            width={336}
            height={305}
            className="aspect-[16/7] w-full rounded-md object-cover"
          />
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
        {[
          ["品牌", "一窗，服务天津家庭住宅玻璃空间。"],
          ["定位", "专业住宅窗膜服务品牌，关注真实居住体验。"],
          ["核心价值", "隔热、隐私、节能，提升居住品质。"],
          ["体验中心", `地址：${site.address}`],
          ["服务方式", `支持上门测量、方案报价和专业安装。电话：${site.phone}`],
          ["品牌风格", "简洁、自然、可信赖，不做夸张承诺。"]
        ].map(([title, text]) => (
          <Card key={title}>
            <h2 className="text-xl font-medium">{title}</h2>
            <p className="mt-3 leading-7 text-ink/68">{text}</p>
          </Card>
        ))}
        </div>
      </section>
    </>
  );
}
