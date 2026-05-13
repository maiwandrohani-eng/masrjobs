/** Walk Prisma / driver error chain for a known `code` (e.g. P2002, P2021). */
export function prismaErrorCode(e: unknown): string | null {
  let cur: unknown = e;
  for (let i = 0; i < 5 && cur && typeof cur === "object"; i += 1) {
    const o = cur as { code?: unknown; cause?: unknown };
    if (typeof o.code === "string") return o.code;
    cur = o.cause;
  }
  return null;
}
