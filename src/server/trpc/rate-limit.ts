import { redis } from "@/lib/redis";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

export async function slidingWindow(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const member = `${now}:${Math.random().toString(36).slice(2, 8)}`;
  const redisKey = `rl:${key}`;

  const pipeline = redis.multi();
  pipeline.zremrangebyscore(redisKey, 0, windowStart);
  pipeline.zadd(redisKey, now, member);
  pipeline.zcard(redisKey);
  pipeline.pexpire(redisKey, windowMs);
  const results = await pipeline.exec();

  const count = results && results[2] ? Number(results[2][1]) : 0;
  const success = count <= limit;
  const remaining = Math.max(0, limit - count);
  const reset = now + windowMs;

  return { success, remaining, reset };
}

export async function checkLimits(
  keys: { key: string; limit: number; windowMs: number }[],
): Promise<RateLimitResult> {
  let worst: RateLimitResult = { success: true, remaining: Infinity, reset: 0 };
  for (const k of keys) {
    const result = await slidingWindow(k.key, k.limit, k.windowMs);
    if (!result.success || result.remaining < worst.remaining) {
      worst = result;
    }
  }
  return worst;
}
