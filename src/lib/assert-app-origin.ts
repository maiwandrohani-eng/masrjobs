function hostnameFromForwardedOrHost(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const h = xf || req.headers.get("host");
  if (!h) return null;
  return h.split(":")[0]?.toLowerCase() ?? null;
}

/** Browser Origin must match this deployment or configured site URLs. */
export function assertAppOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  let requestOrigin: string;
  let originHost: string;
  try {
    const u = new URL(origin);
    requestOrigin = u.origin;
    originHost = u.hostname.toLowerCase();
  } catch {
    return false;
  }

  for (const raw of [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ]) {
    if (!raw?.trim()) continue;
    try {
      if (new URL(raw).origin === requestOrigin) return true;
    } catch {
      /* ignore invalid env URL */
    }
  }

  const host = hostnameFromForwardedOrHost(req);
  if (host && originHost === host) return true;

  return false;
}
