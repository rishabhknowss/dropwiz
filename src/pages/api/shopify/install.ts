import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import {
  buildInstallUrl,
  getShopifyConfig,
  isValidShopDomain,
} from "@/lib/shopify/client";
import { env } from "@/env";
import { generateSecureToken } from "@/lib/auth/tokens";

const STATE_COOKIE = "dw_shopify_state";
const STORE_COOKIE = "dw_shopify_store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  try {
    getShopifyConfig();
  } catch (err) {
    return res
      .status(500)
      .send(err instanceof Error ? err.message : "Shopify not configured");
  }

  const shop = typeof req.query.shop === "string" ? req.query.shop : null;
  const storeId =
    typeof req.query.storeId === "string" ? req.query.storeId : null;

  if (!shop) {
    return res.redirect(302, "/api/shopify/prompt");
  }
  if (!isValidShopDomain(shop)) {
    return res.status(400).send("Invalid shop domain");
  }

  const state = generateSecureToken(16);
  const isProd = env.NODE_ENV === "production";

  const cookies: string[] = [
    serialize(STATE_COOKIE, state, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    }),
  ];
  if (storeId) {
    cookies.push(
      serialize(STORE_COOKIE, storeId, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 600,
      }),
    );
  }
  res.setHeader("Set-Cookie", cookies);

  return res.redirect(302, buildInstallUrl(shop, state));
}
