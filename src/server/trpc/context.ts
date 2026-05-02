import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { ACCESS_COOKIE, REFRESH_COOKIE, sendAuthCookies } from "@/lib/auth/cookies";
import { resolveSession, type SessionUser } from "@/lib/auth/session";
import { getClientIp, getUserAgent } from "@/lib/auth/ip";

export type Context = {
  req: CreateNextContextOptions["req"];
  res: CreateNextContextOptions["res"];
  ip: string;
  userAgent: string;
  session: { user: SessionUser } | null;
};

export async function createContext({ req, res }: CreateNextContextOptions): Promise<Context> {
  const accessToken = req.cookies[ACCESS_COOKIE];
  const refreshToken = req.cookies[REFRESH_COOKIE];

  let session: Awaited<ReturnType<typeof resolveSession>> = null;
  try {
    session = await resolveSession(accessToken, refreshToken);

    if (session?.rotated) {
      await sendAuthCookies(res, session.user.id, session.user.refreshTokenVersion);
    }
  } catch (err) {
    console.error("[context] session resolution failed:", err);
    session = null;
  }

  return {
    req,
    res,
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
    session: session ? { user: session.user } : null,
  };
}
