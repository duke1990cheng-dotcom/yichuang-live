import { NextRequest } from "next/server";

function jsonResponse(payload: Record<string, string>, status = 200) {
  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store"
    },
    status
  });
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("cms_oauth_state")?.value;

  if (!clientId || !clientSecret) {
    return jsonResponse({ error: "GitHub 登录密钥没有配置完整。" }, 500);
  }

  if (!code || !state || state !== storedState) {
    return jsonResponse({ error: "登录状态已过期，请关闭窗口后重新登录。" }, 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Yichuang CMS"
      },
      method: "POST",
      signal: controller.signal
    });

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenData.access_token) {
      return jsonResponse(
        {
          error: tokenData.error_description ?? tokenData.error ?? "GitHub 没有返回登录 token。"
        },
        400
      );
    }

    return jsonResponse({ token: tokenData.access_token });
  } catch {
    return jsonResponse({ error: "连接 GitHub 超时，请稍后再试。" }, 504);
  } finally {
    clearTimeout(timeout);
  }
}
