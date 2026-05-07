import type { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env";
import { resolveSession } from "@/lib/auth/session";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { getStripe } from "@/lib/stripe/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const session = await resolveSession(
    req.cookies[ACCESS_COOKIE],
    req.cookies[REFRESH_COOKIE],
  );
  if (!session) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (!env.STRIPE_PRO_PRICE_ID) {
    return res.status(500).json({ error: "stripe_not_configured" });
  }

  const userRows = await db
    .select({ email: users.email, stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = userRows[0];
  if (!user) {
    return res.status(404).json({ error: "user_not_found" });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      client_reference_id: session.userId,
      customer: user.stripeCustomerId ?? undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/app/stores?subscription=success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/app/stores`,
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[stripe] checkout creation failed:", err);
    return res.status(500).json({ error: "checkout_failed" });
  }
}
