import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { verifyAccessToken, verifyRefreshToken } from "./jwt";

const REFRESH_GRACE_MS = 30_000;

export type SessionUser = Pick<
  User,
  "id" | "email" | "name" | "image" | "locale" | "emailVerified" | "refreshTokenVersion"
>;

export type SessionResult =
  | { userId: string; user: SessionUser; rotated: boolean }
  | null;

export async function resolveSession(
  accessToken: string | undefined,
  refreshToken: string | undefined,
): Promise<SessionResult> {
  if (accessToken) {
    const claims = await verifyAccessToken(accessToken);
    if (claims) {
      const user = await getSessionUser(claims.userId);
      if (user) return { userId: user.id, user, rotated: false };
    }
  }

  if (!refreshToken) return null;

  const refresh = await verifyRefreshToken(refreshToken);
  if (!refresh) return null;

  const user = await getSessionUser(refresh.userId);
  if (!user) return null;

  const versionsMatch = refresh.version === user.refreshTokenVersion;
  const isVersionMinusOne = refresh.version === user.refreshTokenVersion - 1;

  if (!versionsMatch && !isVersionMinusOne) {
    await db
      .update(users)
      .set({
        refreshTokenVersion: sql`${users.refreshTokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
    return null;
  }

  const now = Date.now();
  const last = (await getLastRefreshAt(user.id))?.getTime() ?? 0;

  if (isVersionMinusOne) {
    if (now - last < REFRESH_GRACE_MS) {
      return { userId: user.id, user, rotated: false };
    }
    await db
      .update(users)
      .set({
        refreshTokenVersion: sql`${users.refreshTokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
    return null;
  }

  if (now - last < REFRESH_GRACE_MS) {
    return { userId: user.id, user, rotated: true };
  }

  const [updated] = await db
    .update(users)
    .set({
      refreshTokenVersion: sql`${users.refreshTokenVersion} + 1`,
      lastRefreshAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .returning();

  if (!updated) return null;

  return {
    userId: updated.id,
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      image: updated.image,
      locale: updated.locale,
      emailVerified: updated.emailVerified,
      refreshTokenVersion: updated.refreshTokenVersion,
    },
    rotated: true,
  };
}

async function getSessionUser(userId: string): Promise<SessionUser | null> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      locale: users.locale,
      emailVerified: users.emailVerified,
      refreshTokenVersion: users.refreshTokenVersion,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0] ?? null;
}

async function getLastRefreshAt(userId: string): Promise<Date | null> {
  const rows = await db
    .select({ lastRefreshAt: users.lastRefreshAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0]?.lastRefreshAt ?? null;
}
