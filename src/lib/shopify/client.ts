import axios from "axios";
import crypto from "crypto";
import { env } from "@/env";

const SHOPIFY_SCOPES =
  "read_products,write_products,read_publications,write_publications";

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

export function shopifyGraphql<T>(
  shop: string,
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  return axios
    .post<{ data: T; errors?: unknown }>(
      `https://${shop}/admin/api/2024-10/graphql.json`,
      { query, variables },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        timeout: 30_000,
      },
    )
    .then((res) => {
      if (res.data.errors) {
        throw new Error(`Shopify GraphQL: ${JSON.stringify(res.data.errors)}`);
      }
      return res.data.data;
    });
}
