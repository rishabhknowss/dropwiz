import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { authEvents, subscriptions, users } from "@/db/schema";
import { env } from "@/env";
import { getStripe } from "@/lib/stripe/client";
import { sendProWelcomeEmail } from "@/lib/stripe/emails";

export const config = { api: { bodyParser: false } };

const readRawBody = async (req: NextApiRequest): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array));
  }
  return Buffer.concat(chunks).toString("utf8");
};

const handleCreditsPurchase = async (
  userId: string,
  customerId: string | null,
  metadata: Record<string, string>,
): Promise<void> => {
  const credits = parseInt(metadata.credits ?? "0", 10);
  if (credits <= 0) return;

  if (customerId) {
    await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        imageCredits: sql`${users.imageCredits} + ${credits}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  } else {
    await db
      .update(users)
      .set({
        imageCredits: sql`${users.imageCredits} + ${credits}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  await db.insert(authEvents).values({
    userId,
    kind: "stripe.credits_purchased",
    ip: "webhook",
    userAgent: "stripe-webhook",
    success: 1,
    metadata: JSON.stringify({ credits, customerId }),
  });
};

const handleCheckoutCompleted = async (event: Stripe.Event): Promise<void> => {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.client_reference_id;
  const customerId = session.customer as string;

  if (!userId) return;

  const metadata = session.metadata ?? {};
  if (metadata.type === "credits") {
    await handleCreditsPurchase(userId, customerId, metadata);
    return;
  }

  const subscriptionId = session.subscription as string;
  if (!customerId || !subscriptionId) return;

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const periodStart = (subscription as unknown as { current_period_start?: number }).current_period_start;
  const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;

  await db
    .update(users)
    .set({
      stripeCustomerId: customerId,
      tier: "pro",
      billingSource: "stripe",
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await db.insert(subscriptions).values({
    userId,
    billingSource: "stripe",
    tier: "pro",
    status: "active",
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    stripePriceId: priceId,
    interval: subscription.items.data[0]?.price.recurring?.interval ?? "month",
    currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
  });

  await db.insert(authEvents).values({
    userId,
    kind: "stripe.checkout_completed",
    ip: "webhook",
    userAgent: "stripe-webhook",
    success: 1,
    metadata: JSON.stringify({ customerId, subscriptionId }),
  });

  const userRows = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userRows[0]) {
    await sendProWelcomeEmail(userRows[0].email).catch(console.error);
  }
};

const handleSubscriptionUpdated = async (event: Stripe.Event): Promise<void> => {
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionId = subscription.id;
  const status = mapSubscriptionStatus(subscription.status);
  const periodStart = (subscription as unknown as { current_period_start?: number }).current_period_start;
  const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;

  const [updated] = await db
    .update(subscriptions)
    .set({
      status,
      currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ? 1 : 0,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .returning({ userId: subscriptions.userId });

  if (updated && status === "active") {
    await db
      .update(users)
      .set({ tier: "pro", updatedAt: new Date() })
      .where(eq(users.id, updated.userId));
  }
};

const handleSubscriptionDeleted = async (event: Stripe.Event): Promise<void> => {
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionId = subscription.id;

  const [updated] = await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .returning({ userId: subscriptions.userId });

  if (updated) {
    await db
      .update(users)
      .set({ tier: "free", billingSource: null, updatedAt: new Date() })
      .where(eq(users.id, updated.userId));

    await db.insert(authEvents).values({
      userId: updated.userId,
      kind: "stripe.subscription_canceled",
      ip: "webhook",
      userAgent: "stripe-webhook",
      success: 1,
      metadata: JSON.stringify({ subscriptionId }),
    });
  }
};

const handlePaymentFailed = async (event: Stripe.Event): Promise<void> => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = (invoice as unknown as { subscription?: string }).subscription;

  if (!subscriptionId) return;

  const [updated] = await db
    .update(subscriptions)
    .set({ status: "past_due", updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .returning({ userId: subscriptions.userId });

  if (updated) {
    await db.insert(authEvents).values({
      userId: updated.userId,
      kind: "stripe.payment_failed",
      ip: "webhook",
      userAgent: "stripe-webhook",
      success: 0,
      metadata: JSON.stringify({ subscriptionId, invoiceId: invoice.id }),
    });
  }
};

const mapSubscriptionStatus = (
  status: string,
): "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "paused" => {
  if (status === "active") return "active";
  if (status === "canceled") return "canceled";
  if (status === "past_due") return "past_due";
  if (status === "trialing") return "trialing";
  if (status === "paused") return "paused";
  return "incomplete";
};

const handlers: Record<string, (event: Stripe.Event) => Promise<void>> = {
  "checkout.session.completed": handleCheckoutCompleted,
  "customer.subscription.updated": handleSubscriptionUpdated,
  "customer.subscription.deleted": handleSubscriptionDeleted,
  "invoice.payment_failed": handlePaymentFailed,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "webhook_not_configured" });
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({ error: "missing_signature" });
  }

  const rawBody = await readRawBody(req);

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return res.status(400).json({ error: "invalid_signature" });
  }

  const eventHandler = handlers[event.type];
  if (eventHandler) {
    try {
      await eventHandler(event);
    } catch (err) {
      console.error(`[stripe-webhook] ${event.type} handler failed:`, err);
      return res.status(500).json({ error: "handler_failed" });
    }
  }

  return res.status(200).json({ received: true });
}
