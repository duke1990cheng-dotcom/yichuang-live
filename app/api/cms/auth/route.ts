import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID is not configured.", { status: 500 });
  }

  const state = crypto.randomUUID();
  const redirectUri = new URL("/api/cms/callback", request.nextUrl.origin);
  const githubUrl = new URL("https://github.com/login/oauth/authorize");

  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri.toString());
  githubUrl.searchParams.set("scope", "repo,user:email");
  githubUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubUrl);

  response.cookies.set("cms_oauth_state", state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/api/cms",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:"
  });

  return response;
}
