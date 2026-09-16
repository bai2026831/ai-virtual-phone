export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const targetHost = "api.dzzi.ai";
  const url = new URL(req.url);
  const targetPath = url.pathname.replace("/api/proxy-dzzi", "");
  const targetUrl = `https://${targetHost}${targetPath}${url.search}`;

  const headers = new Headers(req.headers);
  const upstreamRes = await fetch(targetUrl, {
    method: req.method,
    headers: headers,
    body: req.body,
  });

  const resHeaders = new Headers(upstreamRes.headers);
  resHeaders.set("Access-Control-Allow-Origin", "*");
  resHeaders.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  resHeaders.set("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: resHeaders });
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}
