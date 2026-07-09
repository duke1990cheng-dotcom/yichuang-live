import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({ title, description, path }: PageMetadata): Metadata {
  const canonical = path === "/" ? "/" : path;
  const url = `${site.url}${canonical}`;
  const fullTitle = title.includes(site.name) ? title : `${title}｜${site.name}`;

  return {
    title: {
      absolute: fullTitle
    },
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.brand,
      locale: "zh_CN",
      type: "website"
    }
  };
}
