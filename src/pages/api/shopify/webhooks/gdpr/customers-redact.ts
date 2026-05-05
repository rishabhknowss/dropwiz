import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { authEvents } from "@/db/schema";
import {
  readRawBody,
  readWebhookHeaders,
  verifyWebhookHmac,
} from "@/lib/shopify/webhooks";

export const config = { api: { bodyParser: false } };

type CustomerRedactPayload = {
  shop_id?: number;
  shop_domain?: string;
  customer?: { id?: number; email?: string; phone?: string };
  orders_to_redact?: number[];
};

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

  let parsed: CustomerRedactPayload | null = null;
  try {
    parsed = JSON.parse(raw) as CustomerRedactPayload;
  } catch {
    parsed = null;
  }

  try {
    await db.insert(authEvents).values({
      kind: "shopify.gdpr.customers_redact",
      ip: "webhook",
      userAgent: "shopify-webhook",
      success: 1,
      metadata: JSON.stringify({
        shop: headers.shop,
        shopId: parsed?.shop_id,
        webhookId: headers.webhookId,
        customerId: parsed?.customer?.id,
        ordersToRedact: parsed?.orders_to_redact,
        processedAt: new Date().toISOString(),
        note:
          "Dropwiz does not store Shopify shop customer PII. " +
          "We only store merchant OAuth tokens and generated store content. " +
          "No customer data to redact.",
      }),
    });
    return res.status(200).json({
      received: true,
      message: "No customer data stored by Dropwiz",
    });
  } catch (err) {
    console.error("[shopify-webhook gdpr customers-redact]", err);
    return res.status(500).json({ error: "processing_failed" });
  }
}
