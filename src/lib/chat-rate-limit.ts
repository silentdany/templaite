/**
 * In-memory sliding-window rate limit per authenticated user.
 * Fine for single-node dev/small deploys; use Redis/Upstash for multi-instance production.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function consumeChatRateLimit(userId: string): boolean {
  const now = Date.now();
  let bucket = buckets.get(userId);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(userId, bucket);
    return true;
  }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}
