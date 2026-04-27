import type { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts, subscriptions, users } from "@/db/schema";
import { fetchActiveSubscription } from "@/lib/shopify/billing";
import { resolveSession } from "@/lib/auth/session";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const shop = typeof req.query.shop === "string" ? req.query.shop : null;
  const chargeId = typeof req.query.charge_id === "string" ? req.query.charge_id : null;

  if (!shop) {
    return res.redirect(302, "/pricing?error=missing_shop");
  }

  const session = await resolveSession(
    req.cookies[ACCESS_COOKIE],
    req.cookies[REFRESH_COOKIE],
  );
  if (!session) {
    return res.redirect(302, "/auth/signin?next=/pricing");
  }

  try {
    const accountRows = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, session.user.id));
    const shopifyAccount = accountRows.find(
      (a) => a.provider === "shopify" && a.providerAccountId === shop,
    );
    if (!shopifyAccount?.accessToken) {
      return res.redirect(302, "/pricing?error=shop_not_connected");
    }

    const active = await fetchActiveSubscription(shop, shopifyAccount.accessToken);

    if (!active || active.status.toLowerCase() !== "active") {
      return res.redirect(302, "/pricing?error=subscription_pending");
    }

    const name = active.name.toLowerCase();
    const tier = name.includes("agency")
      ? "agency"
      : name.includes("pro") || name.includes("operator")
        ? "pro"
        : name.includes("starter")
          ? "starter"
          : "free";

    await db
      .update(subscriptions)
      .set({
        status: "active",
        tier,
        currentPeriodEnd: active.currentPeriodEnd
          ? new Date(active.currentPeriodEnd)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.shopifyChargeId, chargeId ?? active.id));

    await db
      .update(users)
      .set({
        tier,
        billingSource: "shopify",
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return res.redirect(302, "/app/stores?plan=activated");
  } catch (err) {
    console.error("[shopify-billing callback]", err);
    return res.redirect(302, "/pricing?error=billing_callback_failed");
  }
}
