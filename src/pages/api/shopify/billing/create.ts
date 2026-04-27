import type { NextApiRequest, NextApiResponse } from "next";
import { resolveSession } from "@/lib/auth/session";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { env } from "@/env";
import {
  createAppSubscription,
  SHOPIFY_PLANS,
  type DropwizPlan,
} from "@/lib/shopify/billing";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const shop = typeof req.query.shop === "string" ? req.query.shop : null;
  const plan = typeof req.query.plan === "string" ? req.query.plan : null;

  if (!shop || !plan || !(plan in SHOPIFY_PLANS)) {
    return res.status(400).json({ error: "missing_shop_or_plan" });
  }

  const session = await resolveSession(
    req.cookies[ACCESS_COOKIE],
    req.cookies[REFRESH_COOKIE],
  );
  if (!session) {
    return res.redirect(302, "/auth/signin?next=/pricing");
  }

  try {
    const returnUrl = `${env.NEXT_PUBLIC_APP_URL}/api/shopify/billing/callback?shop=${encodeURIComponent(shop)}`;
    const { confirmationUrl } = await createAppSubscription(
      shop,
      session.user.id,
      plan as DropwizPlan["id"],
      returnUrl,
      env.NODE_ENV !== "production",
    );
    return res.redirect(302, confirmationUrl);
  } catch (err) {
    console.error("[shopify-billing create]", err);
    return res.redirect(302, "/pricing?error=billing_failed");
  }
}
