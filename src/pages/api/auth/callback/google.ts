import type { NextApiRequest, NextApiResponse } from "next";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { accounts, authEvents, users } from "@/db/schema";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  clearOAuthCookies,
  sendAuthCookies,
} from "@/lib/auth/cookies";
import { normalizeEmail } from "@/lib/auth/email-normalize";
import { getClientIp, getUserAgent } from "@/lib/auth/ip";
import {
  exchangeGoogleCode,
  verifyGoogleIdToken,
} from "@/lib/auth/providers/google";
import { checkLimits } from "@/server/trpc/rate-limit";

type AuthEventInput = {
  userId?: string | null;
  kind: string;
  email?: string | null;
  ip: string;
  userAgent: string;
  success: boolean;
  metadata?: Record<string, unknown>;
};

async function logAuthEvent(input: AuthEventInput): Promise<void> {
  try {
    await db.insert(authEvents).values({
      userId: input.userId ?? null,
      kind: input.kind,
      email: input.email ?? null,
      ip: input.ip,
      userAgent: input.userAgent,
      success: input.success ? 1 : 0,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });
  } catch (err) {
    console.error("[auth-event]", input.kind, err);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const ip = getClientIp(req);
  const userAgent = getUserAgent(req);

  const rl = await checkLimits([
    { key: `oauth-callback:ip:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 },
  ]);
  if (!rl.success) {
    return res.redirect(302, "/auth/signin?error=rate_limited");
  }

  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;
  const storedState = req.cookies[OAUTH_STATE_COOKIE];
  const verifier = req.cookies[OAUTH_VERIFIER_COOKIE];

  clearOAuthCookies(res);

  if (!code || !state || !storedState || !verifier || state !== storedState) {
    await logAuthEvent({
      kind: "oauth.state_mismatch",
      ip,
      userAgent,
      success: false,
    });
    return res.redirect(302, "/auth/signin?error=invalid_state");
  }

  try {
    const tokens = await exchangeGoogleCode(code, verifier);
    const idToken = tokens.idToken();
    const profile = await verifyGoogleIdToken(idToken);

    if (!profile.emailVerified) {
      return res.redirect(302, "/auth/signin?error=email_not_verified");
    }

    const emailLower = profile.email.toLowerCase();
    const normalized = normalizeEmail(profile.email);

    const existingByProvider = await db
      .select({ userId: accounts.userId })
      .from(accounts)
      .where(eq(accounts.providerAccountId, profile.sub))
      .limit(1);

    let userId: string | null = existingByProvider[0]?.userId ?? null;

    if (!userId) {
      const existingByEmail = await db
        .select({ id: users.id })
        .from(users)
        .where(or(eq(users.email, emailLower), eq(users.normalizedEmail, normalized)))
        .limit(1);

      if (existingByEmail[0]) {
        userId = existingByEmail[0].id;
      } else {
        const [created] = await db
          .insert(users)
          .values({
            email: emailLower,
            normalizedEmail: normalized,
            name: profile.name,
            image: profile.picture,
            locale: profile.locale?.slice(0, 10) ?? "en",
            emailVerified: new Date(),
          })
          .returning({ id: users.id });
        userId = created.id;
      }

      await db
        .insert(accounts)
        .values({
          userId,
          provider: "google",
          providerAccountId: profile.sub,
          accessToken: tokens.accessToken(),
          refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
          tokenExpiresAt: tokens.accessTokenExpiresAt(),
        })
        .onConflictDoNothing();
    }

    const rows = await db
      .select({
        id: users.id,
        refreshTokenVersion: users.refreshTokenVersion,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, userId!))
      .limit(1);

    const user = rows[0];
    if (!user) {
      return res.redirect(302, "/auth/signin?error=user_not_found");
    }

    if (!user.emailVerified) {
      await db
        .update(users)
        .set({ emailVerified: new Date(), updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    await sendAuthCookies(res, user.id, user.refreshTokenVersion);

    await logAuthEvent({
      userId: user.id,
      kind: "signin.google.success",
      email: emailLower,
      ip,
      userAgent,
      success: true,
    });

    return res.redirect(302, "/app");
  } catch (err) {
    console.error("[oauth-callback] exchange failed:", err);
    await logAuthEvent({
      kind: "oauth.exchange_fail",
      ip,
      userAgent,
      success: false,
      metadata: { error: (err as Error).message },
    });
    return res.redirect(302, "/auth/signin?error=oauth_failed");
  }
}
