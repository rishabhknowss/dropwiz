import type { NextApiRequest, NextApiResponse } from "next";
import { createGoogleAuthUrl } from "@/lib/auth/providers/google";
import { setOAuthCookies } from "@/lib/auth/cookies";
import { checkLimits } from "@/server/trpc/rate-limit";
import { getClientIp } from "@/lib/auth/ip";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const ip = getClientIp(req);
  const rl = await checkLimits([
    { key: `oauth-start:ip:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 },
  ]);
  if (!rl.success) {
    return res.redirect(302, "/auth/signin?error=rate_limited");
  }

  const { url, state, verifier } = createGoogleAuthUrl();
  setOAuthCookies(res, state, verifier);
  res.redirect(302, url.toString());
}
