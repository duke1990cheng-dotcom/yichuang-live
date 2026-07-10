import { NextRequest } from "next/server";

function authResponse(provider: "github", status: "success" | "error", payload: Record<string, string>) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>CMS Login</title>
  </head>
  <body>
    <script>
      (function() {
        var message = "authorization:${provider}:${status}:" + ${JSON.stringify(JSON.stringify(payload))};
        function receiveMessage(event) {
          window.opener.postMessage(message, event.origin);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:${provider}", "*");
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
