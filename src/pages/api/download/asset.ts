import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const ALLOWED_HOSTS = new Set([
  "assets.dropwiz.ai",
  "assets.vibedream.ai",
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const url = typeof req.query.url === "string" ? req.query.url : null;
  const filename =
    typeof req.query.filename === "string"
      ? req.query.filename.replace(/[^a-zA-Z0-9._-]/g, "_")
      : `download-${Date.now()}.png`;

  if (!url) return res.status(400).json({ error: "missing_url" });

  let host: string;
  try {
    host = new URL(url).host;
  } catch {
    return res.status(400).json({ error: "invalid_url" });
  }
  if (!ALLOWED_HOSTS.has(host)) {
    return res.status(403).json({ error: "host_not_allowed" });
  }

  try {
    const upstream = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
      timeout: 30_000,
    });
    res.setHeader(
      "Content-Type",
      String(upstream.headers["content-type"] ?? "application/octet-stream"),
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
    res.setHeader("Cache-Control", "private, max-age=0, no-store");
    return res.status(200).send(Buffer.from(upstream.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "fetch_failed";
    return res.status(502).json({ error: "upstream_failed", message });
  }
}
