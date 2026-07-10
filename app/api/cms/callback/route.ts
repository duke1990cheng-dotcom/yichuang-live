import { NextRequest } from "next/server";

function authResponse(provider: "github", status: "success" | "error", payload: Record<string, string>) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>CMS Login</title>
  </head>
  <body>
    <main style="font-family: system-ui, sans-serif; padding: 32px; color: #222;">
      <h1 style="font-size: 20px;">CMS 登录处理中</h1>
      <p>如果窗口没有自动关闭，请回到后台页面刷新后再试一次。</p>
    </main>
    <script>
      (function() {
        var message = "authorization:${provider}:${status}:" + ${JSON.stringify(JSON.stringify(payload))};
        function send(origin) {
          if (!window.opener) return;
          window.opener.postMessage("authorizing:${provider}", origin || "*");
          window.opener.postMessage(message, origin || "*");
        }
        function receiveMessage(event) {
          send(event.origin);
        }
        window.addEventListener("message", receiveMessage, false);
        send("*");
        var attempts = 0;
        var timer = window.setInterval(function() {
          attempts += 1;
          send("*");
          if (attempts > 10) window.clearInterval(timer);
        }, 500);
        window.setTimeout(function() {
          window.close();
        }, 2500);
      })();
    </script>
  </body>
</html>`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("cms_oauth_state")?.value;

  if (!clientId || !clientSecret) {
    return new Response(authResponse("github", "error", { error: "GitHub OAuth is not configured." }), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 500
    });
  }

  if (!code || !state || state !== storedState) {
    return new Response(authResponse("github", "error", { error: "Invalid OAuth state." }), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 400
    });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  });
  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    return new Response(
      authResponse("github", "error", {
        error: tokenData.error_description ?? tokenData.error ?? "GitHub token exchange failed."
      }),
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
        status: 400
      }
    );
  }

  return new Response(authResponse("github", "success", { token: tokenData.access_token }), {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
