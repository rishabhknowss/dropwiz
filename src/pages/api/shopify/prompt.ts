import type { NextApiRequest, NextApiResponse } from "next";

const HTML = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Connect Shopify — Dropwiz</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #fafaf7; min-height: 100vh; margin: 0; display: grid; place-items: center; }
    .card { background: #121212; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; max-width: 420px; width: 100%; }
    h1 { font-size: 24px; margin: 0 0 8px; letter-spacing: -0.02em; }
    p { color: rgba(255,255,255,0.6); margin: 0 0 20px; font-size: 14px; }
    label { display: block; font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
    input { width: 100%; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; color: #fafaf7; font-size: 14px; margin-bottom: 14px; box-sizing: border-box; }
    button { width: 100%; background: #c7ff3d; color: #0a0a0a; border: none; border-radius: 10px; padding: 12px; font-weight: 600; font-size: 14px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Connect your Shopify store</h1>
    <p>Enter your <code>*.myshopify.com</code> domain. You'll authorize Dropwiz on Shopify, then we'll push your store.</p>
    <form method="GET" action="/api/shopify/install">
      <label for="shop">Shop domain</label>
      <input id="shop" name="shop" placeholder="my-store.myshopify.com" required pattern="^[a-z0-9][a-z0-9-]{0,60}\\.myshopify\\.com$" />
      <button type="submit">Continue to Shopify</button>
    </form>
  </div>
</body>
</html>`;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(HTML);
}
