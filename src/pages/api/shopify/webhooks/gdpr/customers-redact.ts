import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { authEvents } from "@/db/schema";
import {
  readRawBody,
  readWebhookHeaders,
  verifyWebhookHmac,
} from "@/lib/shopify/webhooks";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const raw = await readRawBody(req);
  const headers = readWebhookHeaders(req);

  if (!verifyWebhookHmac(raw, headers.hmac ?? undefined)) {
    return res.status(401).json({ error: "invalid_hmac" });
  }

  try {
    await db.insert(authEvents).values({
      kind: "shopify.gdpr.customers_redact",
      ip: "webhook",
      userAgent: "shopify-webhook",
      success: 1,
      metadata: JSON.stringify({
        shop: headers.shop,
        webhookId: headers.webhookId,
      }),
    });
  } catch (err) {
    console.error("[shopify-webhook gdpr customers-redact]", err);
  }

  return res.status(200).json({ ok: true });
}
