"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMasrJobs } from "@/context/MasrJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import type { SessionUser, UserRole } from "@/lib/types";

function inferRole(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "admin";
  if (e.includes("org") || e.includes("ngo")) return "organization";
  return "individual";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useMasrJobs();
  const demo = isDemoAuthEnabled();
  const [email, setEmail] = useState(demo ? "applicant@demo.org" : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (demo) {
      const role = inferRole(email);
      const local = email.split("@")[0] ?? "User";
      const session: SessionUser = {
        role,
        email,
        displayName: local.replace(/[._-]/g, " "),
        organizationName:
          role === "organization" ? "Care Egypt Foundation" : undefined,
        organizationId: role === "organization" ? "org-2" : undefined,
      };
      login(session);
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "organization") router.push("/dashboard/organization");
      else router.push("/dashboard/user");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setBusy(true);
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard/user";
    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setBusy(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl.startsWith("/") ? callbackUrl : "/dashboard/user");
    router.refresh();
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      {demo ? (
        <p className="text-sm text-foreground/70">
          Demo login: use an email containing <strong>admin</strong>,{" "}
          <strong>org</strong>, or anything else for an applicant account.
        </p>
      ) : (
        <p className="text-sm text-foreground/70">
          Sign in with the email and password you used at registration.
        </p>
      )}
      <label className="mt-6 block text-xs font-semibold text-brand-navy">
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="email"
      />
      <label className="mt-4 block text-xs font-semibold text-brand-navy">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="current-password"
        placeholder={demo ? "Any value in this demo" : ""}
      />
      {error ? (
        <p className="mt-3 text-sm font-medium text-red-700">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-xl bg-brand-navy py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        No account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
