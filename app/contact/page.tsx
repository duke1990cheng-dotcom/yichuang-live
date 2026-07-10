import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/card";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "联系我们",
  description: "联系一窗，咨询天津住宅玻璃膜、隔热膜、隐私膜、建筑膜上门测量、方案报价和专业安装。",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="联系一窗"
        description="天津一窗生活科技有限公司专注住宅窗膜服务，提供隔热、隐私、节能等窗膜方案咨询、上门测量与安装服务。"
      />
      <section className="container-page grid gap-6 py-14 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-medium">天津一窗生活科技有限公司</h2>
          <p className="mt-4 leading-8 text-ink/68">
            品牌：一窗
            <br />
            服务城市：天津
            <br />
            服务：天津玻璃膜、天津隔热膜、天津隐私膜、天津建筑膜、上门测量、方案报价、专业安装
            <br />
            电话：{site.phone}
            <br />
            微信：{site.wechat}
          </p>
          <Link
            href={`tel:${site.phone}`}
            className="focus-ring mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink/88"
          >
            预约上门测量
          </Link>
        </Card>
        <Card>
          <div className="mb-5 rounded-md bg-paper p-2">
            <Image
              src="/images/experience-center-wide.webp"
              alt="一窗窗膜体验中心"
              width={970}
              height={454}
              className="aspect-[16/9] w-full rounded object-cover"
            />
          </div>
          <h2 className="text-xl font-medium">一窗窗膜体验中心</h2>
          <p className="mt-4 leading-8 text-ink/68">
            地址：{site.address}
            <br />
            家里有西晒、落地窗太热、白天隐私不够或家具容易被晒褪色，可以先到店看样膜，也可以电话预约上门测量。
          </p>
        </Card>
      </section>
    </>
  );
}
