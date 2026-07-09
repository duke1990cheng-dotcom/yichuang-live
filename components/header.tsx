import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-4 py-3">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <Image
            src="/brand/logo.png"
            alt="一窗"
            width={900}
            height={560}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink/72 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="focus-ring rounded-md transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="focus-ring rounded-full border border-blue/40 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-blue hover:bg-blue/10"
        >
          预约上门测量
        </Link>
      </div>
      <nav className="container-page flex gap-4 overflow-x-auto pb-3 text-sm text-ink/70 lg:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
