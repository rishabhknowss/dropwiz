import crypto from "crypto";
import type { NextApiRequest } from "next";
import { getShopifyConfig, shopifyGraphql } from "./client";

export async function readRawBody(req: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export function verifyWebhookHmac(rawBody: string, headerHmac: string | undefined): boolean {
  if (!headerHmac) return false;
  const cfg = getShopifyConfig();
  const digest = crypto
    .createHmac("sha256", cfg.secret)
    .update(rawBody, "utf-8")
    .digest("base64");
  const a = Buffer.from(digest, "utf-8");
  const b = Buffer.from(headerHmac, "utf-8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export type WebhookHeaders = {
  shop: string | null;
  topic: string | null;
  webhookId: string | null;
  hmac: string | null;
  apiVersion: string | null;
};

export function readWebhookHeaders(req: NextApiRequest): WebhookHeaders {
  const get = (h: string) => {
    const v = req.headers[h];
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] ?? null : null;
  };
  return {
    shop: get("x-shopify-shop-domain"),
    topic: get("x-shopify-topic"),
    webhookId: get("x-shopify-webhook-id"),
    hmac: get("x-shopify-hmac-sha256"),
    apiVersion: get("x-shopify-api-version"),
  };
}

type WebhookCreateResponse = {
  webhookSubscriptionCreate: {
    webhookSubscription: { id: string } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};

const WEBHOOK_CREATE_MUTATION = `
  mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
      webhookSubscription { id }
      userErrors { field message }
    }
  }
`;

export async function registerShopWebhooks(
  shop: string,
  accessToken: string,
  appUrl: string,
): Promise<{ registered: string[]; errors: string[] }> {
  const registered: string[] = [];
  const errors: string[] = [];

  const topics: Array<{ topic: string; path: string }> = [
    { topic: "APP_UNINSTALLED", path: "/api/shopify/webhooks/app-uninstalled" },
    { topic: "APP_SUBSCRIPTIONS_UPDATE", path: "/api/shopify/webhooks/subscriptions-update" },
  ];

  for (const { topic, path } of topics) {
    try {
      const data = await shopifyGraphql<WebhookCreateResponse>(
        shop,
        accessToken,
        WEBHOOK_CREATE_MUTATION,
        {
          topic,
          webhookSubscription: {
            callbackUrl: `${appUrl}${path}`,
            format: "JSON",
          },
        },
      );
      if (data.webhookSubscriptionCreate.userErrors.length > 0) {
        errors.push(
          `${topic}: ${data.webhookSubscriptionCreate.userErrors
            .map((e) => e.message)
            .join(", ")}`,
        );
      } else {
        registered.push(topic);
      }
    } catch (err) {
      errors.push(`${topic}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { registered, errors };
}
