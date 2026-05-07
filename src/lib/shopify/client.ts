import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { env } from "@/env";

const SHOPIFY_SCOPES =
  "read_products,write_products,read_publications,write_publications,read_orders,read_customers,read_themes,write_themes";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimited = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 429;
  }
  return false;
};

const getRetryAfter = (error: unknown): number => {
  if (error instanceof AxiosError) {
    const retryAfter = error.response?.headers?.["retry-after"];
    if (retryAfter) {
      return parseInt(retryAfter, 10) * 1000;
    }
  }
  return 0;
};

export function getShopifyConfig() {
  const key = env.SHOPIFY_API_KEY;
  const secret = env.SHOPIFY_API_SECRET;
  const appUrl = env.SHOPIFY_APP_URL ?? env.NEXT_PUBLIC_APP_URL;
  if (!key || !secret) {
    throw new Error("Shopify credentials not set (SHOPIFY_API_KEY / SHOPIFY_API_SECRET)");
  }
  return { key, secret, appUrl };
}

export function buildInstallUrl(shop: string, state: string): string {
  const cfg = getShopifyConfig();
  const redirectUri = `${cfg.appUrl}/api/shopify/callback`;
  const params = new URLSearchParams({
    client_id: cfg.key,
    scope: SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
    "grant_options[]": "",
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

export function verifyHmac(query: Record<string, string>): boolean {
  const cfg = getShopifyConfig();
  const { hmac, ...rest } = query;
  delete rest.signature;
  if (!hmac) return false;
  const message = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("&");
  const digest = crypto.createHmac("sha256", cfg.secret).update(message).digest("hex");
  const a = Buffer.from(digest, "hex");
  const b = Buffer.from(hmac, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isValidShopDomain(shop: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,60}\.myshopify\.com$/i.test(shop);
}

export async function exchangeShopifyCode(
  shop: string,
  code: string,
): Promise<{ access_token: string; scope: string }> {
  const cfg = getShopifyConfig();
  const res = await axios.post<{ access_token: string; scope: string }>(
    `https://${shop}/admin/oauth/access_token`,
    {
      client_id: cfg.key,
      client_secret: cfg.secret,
      code,
    },
    { timeout: 15_000 },
  );
  return res.data;
}

export async function shopifyGraphql<T>(
  shop: string,
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.post<{ data: T; errors?: unknown }>(
        `https://${shop}/admin/api/2024-10/graphql.json`,
        { query, variables },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          timeout: 30_000,
        },
      );

      if (res.data.errors) {
        throw new Error(`Shopify GraphQL: ${JSON.stringify(res.data.errors)}`);
      }
      return res.data.data;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES && isRateLimited(error)) {
        const retryAfter = getRetryAfter(error);
        const delay = retryAfter || BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
