import Link from "next/link";
import { navItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-medium">{site.company}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-ink/68">
            {site.slogan}。专注住宅玻璃膜、隔热膜、隐私膜、建筑膜与家具膜服务。
          </p>
        </div>
        <div>
          <p className="font-medium">网站导航</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink/68">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">联系一窗</p>
          <p className="mt-3 text-sm leading-7 text-ink/68">
            城市：天津
            <br />
            体验中心：{site.address}
            <br />
            电话：{site.phone}
            <br />
            微信：{site.wechat}
            <br />
            服务：上门测量、方案报价、专业安装
          </p>
        </div>
      </div>
    </footer>
  );
}
