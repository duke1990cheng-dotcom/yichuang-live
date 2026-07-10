function callbackPage() {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>CMS Login</title>
  </head>
  <body>
    <main style="font-family: system-ui, sans-serif; padding: 32px; color: #222;">
      <h1 style="font-size: 20px;">CMS 登录处理中</h1>
      <p id="status">正在连接 GitHub，请稍等...</p>
    </main>
    <script>
      (function() {
        var statusEl = document.getElementById("status");
        var provider = "github";

        function setStatus(text) {
          if (statusEl) statusEl.textContent = text;
        }

        function sendToCms(message, origin) {
          if (!window.opener) {
            setStatus("没有找到后台窗口。请关闭此窗口，回到后台页面重新点击 GitHub 登录。");
            return;
          }

          window.opener.postMessage(message, origin || "*");
        }

        function sendResult(status, payload) {
          var authMessage = "authorization:" + provider + ":" + status + ":" + JSON.stringify(payload);
          var readyMessage = "authorizing:" + provider;
          var attempts = 0;

          function receiveMessage(event) {
            if (event.data === readyMessage) {
              sendToCms(authMessage, event.origin);
              if (status === "success") {
                setStatus("登录成功，正在返回后台...");
                window.setTimeout(function() {
                  window.close();
                }, 1500);
              }
            }
          }

          window.addEventListener("message", receiveMessage, false);
          sendToCms(readyMessage, "*");
          var timer = window.setInterval(function() {
            attempts += 1;
            sendToCms(readyMessage, "*");
            if (attempts > 10) {
              window.clearInterval(timer);
            }
          }, 500);

          setStatus(status === "success" ? "GitHub 授权成功，正在连接后台..." : "登录失败：" + (payload.error || "未知错误"));
        }

        fetch("/api/cms/token" + window.location.search, { credentials: "same-origin" })
          .then(function(response) {
            return response.json().then(function(data) {
              if (!response.ok) {
                throw new Error(data.error || "GitHub 登录失败。");
              }
              return data;
            });
          })
          .then(function(data) {
            sendResult("success", { token: data.token });
          })
          .catch(function(error) {
            setStatus("登录失败：" + error.message);
            sendResult("error", { error: error.message });
          });
      })();
    </script>
  </body>
</html>`;
}

export function GET() {
  return new Response(callbackPage(), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
