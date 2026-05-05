import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts, authEvents, subscriptions } from "@/db/schema";
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
  if (!headers.shop) return res.status(400).json({ error: "missing_shop" });

  try {
    await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.provider, "shopify"),
          eq(accounts.providerAccountId, headers.shop),
        ),
      );

    await db
      .update(subscriptions)
      .set({
        status: "canceled",
        canceledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.shopifyShop, headers.shop));

    await db.insert(authEvents).values({
      kind: "shopify.app_uninstalled",
      ip: "webhook",
      userAgent: "shopify-webhook",
      success: 1,
      metadata: JSON.stringify({ shop: headers.shop, webhookId: headers.webhookId }),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[shopify-webhook app-uninstalled]", err);
    return res.status(500).json({ error: "processing_failed" });
  }
}
