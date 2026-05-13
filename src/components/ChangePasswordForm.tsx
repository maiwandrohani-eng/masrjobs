"use client";

import { useState } from "react";

function fieldErrorsMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const lines: string[] = [];
  for (const value of Object.values(error as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) lines.push(item);
      }
    }
  }
  return lines.length ? lines.join(" ") : null;
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword.length < 10) {
      setError("New password must be at least 10 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/me/password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: unknown };
    setBusy(false);
    if (!res.ok) {
      const fe = fieldErrorsMessage(data.error);
      setError(
        typeof data.error === "string"
          ? data.error
          : fe ?? "Could not update password. Try again.",
      );
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setSuccess("Password updated. Use the new password next time you sign in on another device.");
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="mt-6 border-t border-brand-border pt-6"
    >
      <h3 className="text-sm font-bold text-brand-navy">Change password</h3>
      <p className="mt-1 text-xs text-foreground/65">
        Requires your current password. Minimum 10 characters for the new password.
      </p>
      <label className="mt-4 block text-xs font-semibold text-brand-navy">Current password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="current-password"
      />
      <label className="mt-4 block text-xs font-semibold text-brand-navy">New password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="new-password"
      />
      <label className="mt-4 block text-xs font-semibold text-brand-navy">Confirm new password</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="new-password"
      />
      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
      {success ? <p className="mt-3 text-sm font-medium text-brand-navy">{success}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted/30 disabled:opacity-60"
      >
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
