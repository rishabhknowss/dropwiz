import type { IncomingMessage } from "http";

export function getClientIp(req: IncomingMessage): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  } else if (Array.isArray(xff) && xff.length > 0) {
    const first = xff[0]?.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) return realIp;

  return req.socket.remoteAddress ?? "unknown";
}

export function getUserAgent(req: IncomingMessage): string {
  const ua = req.headers["user-agent"];
  return typeof ua === "string" ? ua.slice(0, 500) : "unknown";
}
