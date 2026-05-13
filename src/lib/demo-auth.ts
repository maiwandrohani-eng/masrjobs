/** When true, browser-only preview sign-in (localStorage) is enabled. Keep false in production. */
export function isDemoAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";
}
