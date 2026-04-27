import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq } from "drizzle-orm";
import { resolveSession } from "@/lib/auth/session";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { db } from "@/db";
import { assets, stores } from "@/db/schema";
import { uploadAsset, buildStoreAssetKey, publicUrlFor } from "@/lib/storage/r2";

export const config = {
  api: { bodyParser: false, sizeLimit: "20mb" },
};

const ACCEPTED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED_KINDS = new Set(["hero", "lifestyle", "product", "logo", "ad"]);

const readBuffer = async (req: NextApiRequest): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array);
    total += buf.length;
    if (total > MAX_BYTES) {
      throw new Error("Max 10MB");
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "PUT") {
    res.setHeader("Allow", "POST, PUT");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const session = await resolveSession(
    req.cookies[ACCESS_COOKIE],
    req.cookies[REFRESH_COOKIE],
  );
  if (!session) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const storeId = typeof req.query.storeId === "string" ? req.query.storeId : null;
  const kind = typeof req.query.kind === "string" ? req.query.kind : null;
  const contentType = req.headers["content-type"];

  if (!storeId || !kind || !ALLOWED_KINDS.has(kind)) {
    return res.status(400).json({ error: "missing_params" });
  }
  if (!contentType || !ACCEPTED.has(contentType)) {
    return res
      .status(415)
      .json({ error: "unsupported_media_type", message: "PNG, JPEG, WebP, GIF only" });
  }

  const owns = await db
    .select({ id: stores.id })
    .from(stores)
    .where(and(eq(stores.id, storeId), eq(stores.userId, session.userId)))
    .limit(1);
  if (!owns[0]) return res.status(404).json({ error: "store_not_found" });

  let body: Buffer;
  try {
    body = await readBuffer(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload_failed";
    return res.status(413).json({ error: "payload_too_large", message });
  }

  if (body.length === 0) {
    return res.status(400).json({ error: "empty_body" });
  }

  const ext = contentType === "image/jpeg" ? "jpg" : contentType.split("/")[1];
  const key = buildStoreAssetKey(storeId, kind, ext);

  try {
    const result = await uploadAsset({
      key,
      body,
      contentType,
    });
    const [row] = await db
      .insert(assets)
      .values({
        storeId,
        kind: kind as "hero" | "lifestyle" | "product" | "logo" | "ad",
        source: "uploaded",
        r2Key: result.key,
        contentType,
        width: 0,
        height: 0,
        bytes: result.bytes,
      })
      .returning({ id: assets.id });

    const publicUrl = result.publicUrl ?? publicUrlFor(result.key);
    if (!publicUrl) {
      return res.status(500).json({ error: "no_public_url" });
    }
    return res.status(200).json({
      assetId: row.id,
      imageUrl: publicUrl,
      bytes: result.bytes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload_failed";
    return res.status(500).json({ error: "upload_failed", message });
  }
}
