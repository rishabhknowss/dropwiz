import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { authEvents } from "@/db/schema";
import {
  readRawBody,
  readWebhookHeaders,
  verifyWebhookHmac,
} from "@/lib/shopify/webhooks";

export const config = { api: { bodyParser: false } };

type DataRequestPayload = {
  shop_id?: number;
  shop_domain?: string;
  customer?: { id?: number; email?: string; phone?: string };
  data_request?: { id?: number };
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

  let parsed: DataRequestPayload | null = null;
  try {
    parsed = JSON.parse(raw) as DataRequestPayload;
  } catch {
    parsed = null;
  }

  try {
    await db.insert(authEvents).values({
      kind: "shopify.gdpr.customers_data_request",
      ip: "webhook",
      userAgent: "shopify-webhook",
      success: 1,
      metadata: JSON.stringify({
        shop: headers.shop,
        shopId: parsed?.shop_id,
        webhookId: headers.webhookId,
        dataRequestId: parsed?.data_request?.id,
        customerId: parsed?.customer?.id,
        customerEmail: parsed?.customer?.email,
        customerPhone: parsed?.customer?.phone,
        receivedAt: new Date().toISOString(),
        sla: "30 days",
        note:
          "Dropwiz does not store individual Shopify-shop customer PII. " +
          "We hold only the merchant's OAuth token and their generated stores. " +
          "Manual export will be sent to the customer-care address on file within 30 days.",
      }),
    });
  } catch (err) {
    console.error("[shopify-webhook gdpr customers-data-request]", err);
  }

  return res.status(200).json({
    received: true,
    sla_days: 30,
    contact: "privacy@dropwiz.ai",
  });
}
