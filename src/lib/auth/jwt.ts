import { SignJWT, jwtVerify } from "jose";
import { env } from "@/env";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "14d";

const accessKey = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET);
const refreshKey = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

export type AccessClaims = { userId: string; type: "access" };
export type RefreshClaims = { userId: string; version: number; type: "refresh" };

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({ userId, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("dropwiz")
    .setAudience("dropwiz-web")
    .setExpirationTime(ACCESS_TTL)
    .sign(accessKey);
}

export async function signRefreshToken(userId: string, version: number): Promise<string> {
  return new SignJWT({ userId, version, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("dropwiz")
    .setAudience("dropwiz-web")
    .setExpirationTime(REFRESH_TTL)
    .sign(refreshKey);
}

export async function verifyAccessToken(token: string): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, accessKey, {
      algorithms: ["HS256"],
      issuer: "dropwiz",
      audience: "dropwiz-web",
    });
    if (payload.type !== "access" || typeof payload.userId !== "string") return null;
    return { userId: payload.userId, type: "access" };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshClaims | null> {
  try {
    const { payload } = await jwtVerify(token, refreshKey, {
      algorithms: ["HS256"],
      issuer: "dropwiz",
      audience: "dropwiz-web",
    });
    if (
      payload.type !== "refresh" ||
      typeof payload.userId !== "string" ||
      typeof payload.version !== "number"
    )
      return null;
    return { userId: payload.userId, version: payload.version, type: "refresh" };
  } catch {
    return null;
  }
}
