import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts, subscriptions } from "@/db/schema";
import { getShopifyConfig, shopifyGraphql } from "./client";

export type DropwizPlan = {
  id: "starter" | "pro" | "agency";
  name: string;
  priceUsd: number;
  interval: "EVERY_30_DAYS" | "ANNUAL";
  trialDays: number;
};

export const SHOPIFY_PLANS: Record<DropwizPlan["id"], DropwizPlan> = {
  starter: {
    id: "starter",
    name: "Dropwiz Starter",
    priceUsd: 29,
    interval: "EVERY_30_DAYS",
    trialDays: 7,
  },
  pro: {
    id: "pro",
    name: "Dropwiz Pro",
    priceUsd: 79,
    interval: "EVERY_30_DAYS",
    trialDays: 7,
  },
  agency: {
    id: "agency",
    name: "Dropwiz Agency",
    priceUsd: 199,
    interval: "EVERY_30_DAYS",
    trialDays: 0,
  },
};

type SubscriptionCreateResponse = {
  appSubscriptionCreate: {
    confirmationUrl: string | null;
    appSubscription: { id: string; status: string } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};

const SUBSCRIPTION_CREATE_MUTATION = `
  mutation AppSubscriptionCreate(
    $name: String!
    $returnUrl: URL!
    $test: Boolean
    $trialDays: Int
    $lineItems: [AppSubscriptionLineItemInput!]!
  ) {
    appSubscriptionCreate(
      name: $name
      returnUrl: $returnUrl
      test: $test
      trialDays: $trialDays
      lineItems: $lineItems
    ) {
      confirmationUrl
      appSubscription { id status }
      userErrors { field message }
    }
  }
`;

export async function createAppSubscription(
  shop: string,
  userId: string,
  planId: DropwizPlan["id"],
  returnUrl: string,
  testMode = false,
): Promise<{ confirmationUrl: string; chargeId: string }> {
  const plan = SHOPIFY_PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);

  const accountRows = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
  const shopifyAccount = accountRows.find(
    (a) => a.provider === "shopify" && a.providerAccountId === shop,
  );
  if (!shopifyAccount || !shopifyAccount.accessToken) {
    throw new Error("Shopify shop not connected for this user");
  }

  const data = await shopifyGraphql<SubscriptionCreateResponse>(
    shop,
    shopifyAccount.accessToken,
    SUBSCRIPTION_CREATE_MUTATION,
    {
      name: plan.name,
      returnUrl,
      test: testMode,
      trialDays: plan.trialDays,
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: plan.priceUsd, currencyCode: "USD" },
              interval: plan.interval,
            },
          },
        },
      ],
    },
  );

  if (data.appSubscriptionCreate.userErrors.length > 0) {
    throw new Error(
      data.appSubscriptionCreate.userErrors.map((e) => e.message).join(", "),
    );
  }
  if (
    !data.appSubscriptionCreate.confirmationUrl ||
    !data.appSubscriptionCreate.appSubscription
  ) {
    throw new Error("Shopify did not return a confirmation URL");
  }

  const chargeId = data.appSubscriptionCreate.appSubscription.id;

  await db
    .insert(subscriptions)
    .values({
      userId,
      billingSource: "shopify",
      tier: planId,
      status: "incomplete",
      shopifyChargeId: chargeId,
      shopifyShop: shop,
      interval: plan.interval === "ANNUAL" ? "yearly" : "monthly",
      trialEndsAt:
        plan.trialDays > 0
          ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000)
          : null,
    })
    .onConflictDoUpdate({
      target: subscriptions.shopifyChargeId,
      set: {
        userId,
        tier: planId,
        status: "incomplete",
        updatedAt: new Date(),
      },
    });

  return {
    confirmationUrl: data.appSubscriptionCreate.confirmationUrl,
    chargeId,
  };
}

const SUBSCRIPTION_STATUS_QUERY = `
  query CurrentAppInstallation {
    currentAppInstallation {
      activeSubscriptions { id name status currentPeriodEnd trialDays }
    }
  }
`;

type SubscriptionStatusResponse = {
  currentAppInstallation: {
    activeSubscriptions: Array<{
      id: string;
      name: string;
      status: string;
      currentPeriodEnd: string | null;
      trialDays: number;
    }>;
  };
};

export async function fetchActiveSubscription(shop: string, accessToken: string) {
  const data = await shopifyGraphql<SubscriptionStatusResponse>(
    shop,
    accessToken,
    SUBSCRIPTION_STATUS_QUERY,
  );
  return data.currentAppInstallation.activeSubscriptions[0] ?? null;
}

export function isShopifyBillingEnabled(): boolean {
  try {
    getShopifyConfig();
    return true;
  } catch {
    return false;
  }
}
