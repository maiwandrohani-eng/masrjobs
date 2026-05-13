"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Shown inside PageShell on marketing/auth pages — not on `/` or dashboard (dashboard has its own link). */
export function BackToHomeBar() {
  const pathname = usePathname();
  if (!pathname || pathname === "/" || pathname.startsWith("/dashboard")) {
    return null;
  }
  return (
    <nav className="mb-6" aria-label="Site">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-gold decoration-brand-gold/50 underline-offset-4 hover:text-brand-navy hover:underline"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        Back to home
      </Link>
    </nav>
  );
}
