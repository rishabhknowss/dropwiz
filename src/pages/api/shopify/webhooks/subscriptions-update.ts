import type { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { authEvents, subscriptions, users } from "@/db/schema";
import {
  readRawBody,
  readWebhookHeaders,
  verifyWebhookHmac,
} from "@/lib/shopify/webhooks";

export const config = { api: { bodyParser: false } };

type SubscriptionUpdatePayload = {
  app_subscription: {
    admin_graphql_api_id: string;
    name: string;
    status: string;
    admin_graphql_api_shop_id?: string;
    created_at?: string;
    updated_at?: string;
  };
};

function mapStatus(s: string): "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "paused" {
  const v = s.toLowerCase();
  if (v === "active") return "active";
  if (v === "cancelled" || v === "canceled" || v === "expired") return "canceled";
  if (v === "pending") return "incomplete";
  if (v === "frozen") return "paused";
  if (v === "declined") return "canceled";
  return "incomplete";
}

function tierFromName(name: string): "free" | "starter" | "pro" | "agency" | "enterprise" {
  const n = name.toLowerCase();
  if (n.includes("agency")) return "agency";
  if (n.includes("enterprise")) return "enterprise";
  if (n.includes("pro") || n.includes("operator")) return "pro";
  if (n.includes("starter") || n.includes("basic")) return "starter";
  return "free";
}

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

  let payload: SubscriptionUpdatePayload;
  try {
    payload = JSON.parse(raw) as SubscriptionUpdatePayload;
  } catch {
    return res.status(400).json({ error: "invalid_json" });
  }

  try {
    const sub = payload.app_subscription;
    const mappedStatus = mapStatus(sub.status);
    const tier = tierFromName(sub.name);

    const [updated] = await db
      .update(subscriptions)
      .set({
        status: mappedStatus,
        tier,
        updatedAt: new Date(),
        canceledAt: mappedStatus === "canceled" ? new Date() : null,
      })
      .where(eq(subscriptions.shopifyChargeId, sub.admin_graphql_api_id))
      .returning({ userId: subscriptions.userId });

    if (updated) {
      await db
        .update(users)
        .set({ tier, updatedAt: new Date() })
        .where(eq(users.id, updated.userId));
    }

    await db.insert(authEvents).values({
      userId: updated?.userId ?? null,
      kind: "shopify.subscription_update",
      ip: "webhook",
      userAgent: "shopify-webhook",
      success: 1,
      metadata: JSON.stringify({
        shop: headers.shop,
        chargeId: sub.admin_graphql_api_id,
        status: sub.status,
        name: sub.name,
      }),
    });
  } catch (err) {
    console.error("[shopify-webhook subscriptions-update]", err);
  }

  return res.status(200).json({ ok: true });
}
