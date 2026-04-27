import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { db } from "@/db";
import { accounts, authEvents } from "@/db/schema";
import {
  exchangeShopifyCode,
  isValidShopDomain,
  verifyHmac,
} from "@/lib/shopify/client";
import { env } from "@/env";
import { resolveSession } from "@/lib/auth/session";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { getClientIp, getUserAgent } from "@/lib/auth/ip";
import { registerShopWebhooks } from "@/lib/shopify/webhooks";

const STATE_COOKIE = "dw_shopify_state";
const STORE_COOKIE = "dw_shopify_store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const shop = typeof req.query.shop === "string" ? req.query.shop : null;
  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;
  const storedState = req.cookies[STATE_COOKIE];
  const storedStoreId = req.cookies[STORE_COOKIE];

  const isProd = env.NODE_ENV === "production";
  const clearCookies: string[] = [
    serialize(STATE_COOKIE, "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
    serialize(STORE_COOKIE, "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  ];

  if (!shop || !code || !state || !storedState || state !== storedState) {
    res.setHeader("Set-Cookie", clearCookies);
    return res.redirect(302, "/app/stores?error=shopify_state");
  }
  if (!isValidShopDomain(shop)) {
    res.setHeader("Set-Cookie", clearCookies);
    return res.redirect(302, "/app/stores?error=shopify_shop");
  }

  const hmacOk = verifyHmac(
    req.query as Record<string, string>,
  );
  if (!hmacOk) {
    res.setHeader("Set-Cookie", clearCookies);
    return res.redirect(302, "/app/stores?error=shopify_hmac");
  }

  const ip = getClientIp(req);
  const userAgent = getUserAgent(req);
  const session = await resolveSession(
    req.cookies[ACCESS_COOKIE],
    req.cookies[REFRESH_COOKIE],
  );
  if (!session) {
    res.setHeader("Set-Cookie", clearCookies);
    return res.redirect(302, "/auth/signin?error=shopify_no_session");
  }

  try {
    const tokens = await exchangeShopifyCode(shop, code);
    await db
      .insert(accounts)
      .values({
        userId: session.user.id,
        provider: "shopify",
        providerAccountId: shop,
        accessToken: tokens.access_token,
        scope: tokens.scope,
      })
      .onConflictDoUpdate({
        target: [accounts.provider, accounts.providerAccountId],
        set: {
          userId: session.user.id,
          accessToken: tokens.access_token,
          scope: tokens.scope,
          updatedAt: new Date(),
        },
      });

    await db.insert(authEvents).values({
      userId: session.user.id,
      kind: "shopify.connected",
      email: session.user.email,
      ip,
      userAgent,
      success: 1,
      metadata: JSON.stringify({ shop }),
    });

    registerShopWebhooks(shop, tokens.access_token, env.NEXT_PUBLIC_APP_URL)
      .then(async (result) => {
        await db.insert(authEvents).values({
          userId: session.user.id,
          kind: "shopify.webhooks_registered",
          ip: "server",
          userAgent: "server",
          success: result.errors.length === 0 ? 1 : 0,
          metadata: JSON.stringify(result),
        });
      })
      .catch((e) => {
        console.error("[shopify-callback register-webhooks]", e);
      });

    res.setHeader("Set-Cookie", clearCookies);

    if (storedStoreId) {
      return res.redirect(
        302,
        `/app/stores/${storedStoreId}/edit?shopify=connected`,
      );
    }

    return res.redirect(302, "/app/stores?shopify=connected");
  } catch (err) {
    console.error("[shopify-callback]", err);
    res.setHeader("Set-Cookie", clearCookies);
    try {
      await db.insert(authEvents).values({
        kind: "shopify.exchange_fail",
        ip,
        userAgent,
        success: 0,
        metadata: JSON.stringify({
          error: err instanceof Error ? err.message : String(err),
        }),
      });
    } catch {}
    return res.redirect(302, "/app/stores?error=shopify_exchange");
  }
}
