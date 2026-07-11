import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yichuang.live"),
  title: {
    default: "一窗生活科技｜天津住宅窗膜隔热膜隐私膜服务",
    template: "%s｜一窗生活科技"
  },
  description:
    "一窗生活科技专注天津住宅玻璃膜、隔热膜、隐私膜、建筑膜服务，提供上门测量、方案报价和专业安装。",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "一窗生活科技｜天津住宅窗膜隔热膜隐私膜服务",
    description:
      "专业窗膜服务 · 提升居住品质。一窗提供住宅玻璃膜、隔热膜、隐私膜、建筑膜上门测量与安装。",
    locale: "zh_CN",
    siteName: "一窗",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
