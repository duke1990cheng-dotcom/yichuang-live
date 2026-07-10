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

          try {
            window.opener.postMessage(message, origin || window.location.origin);
          } catch (error) {
            window.opener.postMessage(message, "*");
          }
        }

        function sendResult(status, payload) {
          var authMessage = "authorization:" + provider + ":" + status + ":" + JSON.stringify(payload);
          sendToCms(authMessage, window.location.origin);
          sendToCms(authMessage, "*");
        }

        function deliverToken(token) {
          var attempts = 0;
          var completed = false;
          var message = { type: "yichuang-cms-token", token: token };

          function finishLogin() {
            if (completed) return;
            completed = true;
            setStatus("登录成功，正在返回后台...");
            window.setTimeout(function() {
              window.close();
            }, 1200);
          }

          function sendToken() {
            sendToCms(message, window.location.origin);
            sendToCms(message, "https://yichuang.live");
            sendToCms(message, "https://www.yichuang.live");
            sendToCms(message, "*");

            try {
              if (window.opener && window.opener.localStorage) {
                window.opener.localStorage.setItem(
                  "decap-cms-user",
                  JSON.stringify({
                    backendName: "github",
                    token: token
                  })
                );
                window.opener.location.replace("/admin/index.html");
                finishLogin();
              }
            } catch (error) {
              // Cross-origin admin windows are handled through postMessage above.
            }
          }

          function receiveMessage(event) {
            var data = event.data || {};
            if (data.type === "yichuang-cms-token-stored") {
              finishLogin();
            }
          }

          window.addEventListener("message", receiveMessage, false);
          sendToken();
          var timer = window.setInterval(function() {
            attempts += 1;
            sendToken();
            if (!completed) {
              setStatus("GitHub 授权成功，正在进入后台...（第 " + attempts + " 次尝试）");
            }
            if (attempts > 60 || completed) {
              window.clearInterval(timer);
              if (!completed) {
                setStatus("GitHub 授权成功，但后台页面暂时没有响应。请关闭这个小窗口，刷新 /admin 页面后再试一次。");
              }
            }
          }, 500);

          sendResult("success", { token: token });
          setStatus("GitHub 授权成功，正在进入后台...");
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
            deliverToken(data.token);
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
