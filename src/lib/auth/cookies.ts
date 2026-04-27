import { serialize, type SerializeOptions } from "cookie";
import type { ServerResponse } from "http";
import { env } from "@/env";
import { signAccessToken, signRefreshToken } from "./jwt";

export const ACCESS_COOKIE = "dw_access";
export const REFRESH_COOKIE = "dw_refresh";
export const OAUTH_STATE_COOKIE = "dw_oauth_state";
export const OAUTH_VERIFIER_COOKIE = "dw_oauth_verifier";

const isProd = env.NODE_ENV === "production";

const baseOptions: SerializeOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  path: "/",
};

const accessOptions: SerializeOptions = { ...baseOptions, maxAge: 60 * 15 };
const refreshOptions: SerializeOptions = { ...baseOptions, maxAge: 60 * 60 * 24 * 14 };
const oauthShortOptions: SerializeOptions = { ...baseOptions, maxAge: 60 * 10 };

export async function sendAuthCookies(
  res: ServerResponse,
  userId: string,
  refreshTokenVersion: number,
): Promise<void> {
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(userId),
    signRefreshToken(userId, refreshTokenVersion),
  ]);
  appendSetCookie(res, [
    serialize(ACCESS_COOKIE, accessToken, accessOptions),
    serialize(REFRESH_COOKIE, refreshToken, refreshOptions),
  ]);
}

export function clearAuthCookies(res: ServerResponse): void {
  appendSetCookie(res, [
    serialize(ACCESS_COOKIE, "", { ...baseOptions, maxAge: 0 }),
    serialize(REFRESH_COOKIE, "", { ...baseOptions, maxAge: 0 }),
  ]);
}

export function setOAuthCookies(res: ServerResponse, state: string, verifier: string): void {
  appendSetCookie(res, [
    serialize(OAUTH_STATE_COOKIE, state, oauthShortOptions),
    serialize(OAUTH_VERIFIER_COOKIE, verifier, oauthShortOptions),
  ]);
}

export function clearOAuthCookies(res: ServerResponse): void {
  appendSetCookie(res, [
    serialize(OAUTH_STATE_COOKIE, "", { ...baseOptions, maxAge: 0 }),
    serialize(OAUTH_VERIFIER_COOKIE, "", { ...baseOptions, maxAge: 0 }),
  ]);
}

function appendSetCookie(res: ServerResponse, cookies: string[]): void {
  const existing = res.getHeader("Set-Cookie");
  const merged = Array.isArray(existing)
    ? [...existing, ...cookies]
    : typeof existing === "string"
      ? [existing, ...cookies]
      : cookies;
  res.setHeader("Set-Cookie", merged);
}
