import type { Metadata } from "next";
import { Card } from "@/components/card";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "服务项目",
  description: "一窗提供天津住宅窗膜、天津玻璃膜、天津隔热膜、天津隐私膜、天津建筑膜、落地窗隔热、阳光房隔热、家具膜、上门测量和专业安装服务。",
  path: "/services"
});

const services = [
  {
    title: "住宅隔热膜",
    problem: "改善西晒、玻璃附近热感和夏季空调压力。",
    scene: "适合客厅、卧室、阳台等天津住宅窗膜场景。",
    measure: "支持上门测量"
  },
  {
    title: "住宅隐私膜",
    problem: "减少白天外部视线直视，提升家庭私密性。",
    scene: "适合低楼层、临街、楼间距较近的天津隐私膜需求。",
    measure: "支持上门测量"
  },
  {
    title: "建筑玻璃膜",
    problem: "改善建筑玻璃带来的热、晒、眩光和紫外线问题。",
    scene: "适合住宅阳台、飘窗、书房和天津建筑膜应用。",
    measure: "支持上门测量"
  },
  {
    title: "落地窗隔热",
    problem: "降低大面积玻璃带来的热量累积和眩光。",
    scene: "适合天津落地窗隔热、客厅阳台和大玻璃窗。",
    measure: "支持上门测量"
  },
  {
    title: "阳光房隔热",
    problem: "改善阳光房夏季闷热、强光和家具暴晒。",
    scene: "适合天津阳光房隔热、顶面玻璃和侧面玻璃。",
    measure: "支持上门测量"
  },
  {
    title: "家具膜",
    problem: "减少家具、地板、窗帘被阳光长期晒褪色。",
    scene: "适合靠窗柜体、木地板、皮沙发和定制家具。",
    measure: "支持上门测量"
  }
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="SERVICES"
        title="围绕住宅玻璃的窗膜服务"
        description="从天津玻璃膜、天津隔热膜、天津隐私膜到红星美凯龙窗膜体验咨询，一窗根据家庭真实使用场景提供可落地的产品选择和施工服务。"
      />
      <section className="container-page grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title}>
            <h2 className="text-xl font-medium">{service.title}</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-ink/68">
              <p><span className="font-medium text-ink">解决问题：</span>{service.problem}</p>
              <p><span className="font-medium text-ink">适合场景：</span>{service.scene}</p>
              <p><span className="font-medium text-ink">测量服务：</span>{service.measure}</p>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
