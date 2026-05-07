import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { env } from "@/env";
import { getStripe } from "@/lib/stripe/client";
import { getCreditPackByPriceId } from "@/lib/stripe/credit-packs";
import { protectedProcedure, router } from "../trpc";

export const billingRouter = router({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({
        id: subscriptions.id,
        tier: subscriptions.tier,
        status: subscriptions.status,
        billingSource: subscriptions.billingSource,
        interval: subscriptions.interval,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
        createdAt: subscriptions.createdAt,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "active"),
        ),
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    return rows[0] ?? null;
  }),

  createCheckoutUrl: protectedProcedure.mutation(async ({ ctx }) => {
    if (!env.STRIPE_PRO_PRICE_ID) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe is not configured",
      });
    }

    const userRows = await db
      .select({ email: users.email, stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    const user = userRows[0];
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      client_reference_id: ctx.user.id,
      customer: user.stripeCustomerId ?? undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/app/stores?subscription=success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/app/stores`,
      allow_promotion_codes: true,
    });

    if (!checkoutSession.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { url: checkoutSession.url };
  }),

  createPortalUrl: protectedProcedure.mutation(async ({ ctx }) => {
    const userRows = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    const user = userRows[0];
    if (!user?.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription",
      });
    }

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/app/settings`,
    });

    return { url: portalSession.url };
  }),

  createCreditsCheckoutUrl: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pack = getCreditPackByPriceId(input.priceId);
      if (!pack) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credit pack",
        });
      }

      const userRows = await db
        .select({ email: users.email, stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      const user = userRows[0];
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const stripe = getStripe();
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: input.priceId, quantity: 1 }],
        client_reference_id: ctx.user.id,
        customer: user.stripeCustomerId ?? undefined,
        customer_email: user.stripeCustomerId ? undefined : user.email,
        success_url: `${env.NEXT_PUBLIC_APP_URL}/app/settings?credits=success`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/app/settings`,
        metadata: {
          type: "credits",
          credits: pack.credits.toString(),
          userId: ctx.user.id,
        },
      });

      if (!checkoutSession.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: checkoutSession.url };
    }),
});
