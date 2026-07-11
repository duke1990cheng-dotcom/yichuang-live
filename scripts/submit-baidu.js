const siteEnv = process.env.BAIDU_SITE;
const token = process.env.BAIDU_TOKEN;

function normalizeSite(site) {
  if (!site) {
    return null;
  }

  const withProtocol = /^https?:\/\//.test(site) ? site : `https://${site}`;
  return new URL(withProtocol);
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim()).filter(Boolean);
}

async function main() {
  const siteUrl = normalizeSite(siteEnv);

  if (!siteUrl || !token) {
    console.error("Missing BAIDU_SITE or BAIDU_TOKEN.");
    console.error("Example: BAIDU_SITE=https://www.yichuang.live BAIDU_TOKEN=your_token npm run submit:baidu");
    process.exit(1);
  }

  const sitemapUrl = new URL("/sitemap.xml", siteUrl.origin).toString();
  const sitemapResponse = await fetch(sitemapUrl);

  if (!sitemapResponse.ok) {
    throw new Error(`Failed to read sitemap: ${sitemapUrl} (${sitemapResponse.status})`);
  }

  const sitemapXml = await sitemapResponse.text();
  const urls = extractUrls(sitemapXml).filter((url) => url.startsWith(siteUrl.origin));

  if (urls.length === 0) {
    console.log("No URLs found in sitemap.");
    return;
  }

  const endpoint = `https://data.zz.baidu.com/urls?site=${encodeURIComponent(siteUrl.host)}&token=${encodeURIComponent(token)}`;
  const response = await fetch(endpoint, {
    body: urls.join("\n"),
    headers: {
      "Content-Type": "text/plain"
    },
    method: "POST"
  });
  const result = await response.text();

  console.log(`Submitted ${urls.length} URLs to Baidu.`);
  console.log(result);

  if (!response.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
