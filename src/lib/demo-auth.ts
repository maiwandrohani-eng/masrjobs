/** When true, legacy client-only demo login (localStorage) is enabled. Disable in production. */
export function isDemoAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";
}
