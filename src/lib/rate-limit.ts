type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;

function prune(key: string, now: number) {
  const b = buckets.get(key);
  if (b && now > b.resetAt) buckets.delete(key);
}

/**
 * Simple in-memory fixed-window rate limiter per key (e.g. IP + route).
 * For multi-instance production, replace with Redis / Vercel KV.
 */
export function rateLimit(key: string, max: number): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  prune(key, now);
  let b = buckets.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, b);
  }
  if (b.count >= max) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}
