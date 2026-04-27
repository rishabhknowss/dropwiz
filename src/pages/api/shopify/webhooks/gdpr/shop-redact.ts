import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts, authEvents, stores } from "@/db/schema";
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
      .update(stores)
      .set({
        publishedShopifyShop: null,
        publishedShopifyProductId: null,
        publishedShopifyUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(stores.publishedShopifyShop, headers.shop));

    await db.insert(authEvents).values({
      kind: "shopify.gdpr.shop_redact",
      ip: "webhook",
      userAgent: "shopify-webhook",
      success: 1,
      metadata: JSON.stringify({
        shop: headers.shop,
        webhookId: headers.webhookId,
      }),
    });
  } catch (err) {
    console.error("[shopify-webhook gdpr shop-redact]", err);
  }

  return res.status(200).json({ ok: true });
}
