import { Google, generateState, generateCodeVerifier } from "arctic";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "@/env";

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
);

const GOOGLE_ISSUER = "https://accounts.google.com";
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
  locale?: string;
};

export function createGoogleAuthUrl(): {
  url: URL;
  state: string;
  verifier: string;
} {
  const state = generateState();
  const verifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, verifier, [
    "openid",
    "email",
    "profile",
  ]);
  return { url, state, verifier };
}

export async function exchangeGoogleCode(code: string, verifier: string) {
  return google.validateAuthorizationCode(code, verifier);
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: [GOOGLE_ISSUER, "accounts.google.com"],
    audience: env.GOOGLE_CLIENT_ID,
    algorithms: ["RS256"],
  });
  const sub = payload.sub;
  const email = payload.email;
  if (typeof sub !== "string" || typeof email !== "string") {
    throw new Error("Invalid Google id_token payload");
  }
  return {
    sub,
    email,
    emailVerified: payload.email_verified === true,
    name: typeof payload.name === "string" ? payload.name : undefined,
    picture: typeof payload.picture === "string" ? payload.picture : undefined,
    locale: typeof payload.locale === "string" ? payload.locale : undefined,
  };
}
