"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useMasrJobs } from "@/context/MasrJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";

type ProfilePayload = {
  organizationName: string;
  about: string;
  location: string;
  website: string;
  phone: string;
  verificationStatus: string;
};

function formatSaveError(body: unknown): string {
  if (!body || typeof body !== "object") return "Save failed.";
  const err = (body as { error?: unknown }).error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const parts: string[] = [];
    for (const [, v] of Object.entries(err as Record<string, unknown>)) {
      if (Array.isArray(v) && v.length) parts.push(String(v[0]));
    }
    if (parts.length) return parts.join(" ");
  }
  return "Save failed.";
}

export function EmployerOrganizationProfilePanel() {
  const { refreshPublicCatalog } = useMasrJobs();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [authBlocked, setAuthBlocked] = useState(false);
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [orgName, setOrgName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    setAuthBlocked(false);
    try {
      const res = await fetch("/api/organization/profile", { credentials: "include" });
      const data = (await res.json()) as { ok?: boolean; data?: ProfilePayload; error?: string };
      if (res.status === 401) {
        setAuthBlocked(true);
        return;
      }
      if (res.status === 403 && typeof data.error === "string") {
        setMsg(data.error);
        setAuthBlocked(true);
        return;
      }
      if (!res.ok || !data.ok || !data.data) {
        throw new Error(data.error || "Could not load your organization profile.");
      }
      const d = data.data;
      setOrgName(d.organizationName);
      setAbout(d.about);
      setLocation(d.location);
      setWebsite(d.website);
      setPhone(d.phone);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/organization/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          about,
          location,
          website,
          phone,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.ok) {
        setMsg(formatSaveError(body));
        return;
      }
      setMsg("Profile saved. Updates appear in the organization directory and opportunity browse.");
      refreshPublicCatalog();
    } catch {
      setMsg("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-base font-bold text-brand-navy">Edit public organization profile</h2>
        {!authBlocked && !loading ? (
          <span className="shrink-0 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-navy">
            Editable
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-foreground/70">
        Candidates see this information in the{" "}
        <a className="font-semibold text-brand-gold underline" href="/organizations">
          organization directory
        </a>
        . Update your story, location, website, and phone here, then save.
        {orgName ? (
          <>
            {" "}
            <span className="text-foreground/55">Registered name:</span>{" "}
            <span className="font-medium text-brand-navy">{orgName}</span> (contact support to
            change the legal name on the account).
          </>
        ) : null}
      </p>

      {authBlocked ? (
        <div className="mt-4 rounded-xl border border-brand-border bg-brand-muted/50 px-4 py-3 text-sm text-foreground/85">
          <p className="font-semibold text-brand-navy">Cannot load profile for editing</p>
          <p className="mt-2">
            Sign in with your organization email and password from registration.
            {isDemoAuthEnabled() ? (
              <>
                {" "}
                With <strong>preview sign-in</strong> enabled, open{" "}
                <Link href="/login" className="font-semibold text-brand-gold underline">
                  Login
                </Link>{" "}
                and choose <strong>Database account (Neon)</strong> before entering your credentials.
              </>
            ) : (
              <>
                {" "}
                Open{" "}
                <Link href="/login" className="font-semibold text-brand-gold underline">
                  Login
                </Link>{" "}
                if you need to switch accounts.
              </>
            )}
          </p>
          {msg ? <p className="mt-2 text-red-800">{msg}</p> : null}
        </div>
      ) : null}

      {authBlocked ? null : (
      <div className="mt-4 rounded-xl border border-brand-border bg-brand-muted/40 p-4 text-sm text-foreground/80">
        <p className="font-semibold text-brand-navy">What to include in “About your organization”</p>
        <ul className="mt-2 list-inside list-disc space-y-1.5">
          <li>Mission and main programme areas (e.g. health, education, livelihoods).</li>
          <li>Where you work in Egypt or regionally, and typical roles you hire for.</li>
          <li>Registration or partnership context if helpful (without sharing sensitive IDs).</li>
          <li>How you approach safeguarding, equal opportunity, or language requirements if relevant.</li>
        </ul>
        <p className="mt-2 text-xs text-foreground/60">
          Plain text only; line breaks are preserved. Up to 12,000 characters.
        </p>
      </div>
      )}

      {authBlocked ? null : loading ? (
        <p className="mt-6 text-sm text-foreground/60">Loading profile…</p>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={onSave}>
          <div>
            <label htmlFor="org-about" className="block text-sm font-semibold text-brand-navy">
              About your organization
            </label>
            <textarea
              id="org-about"
              name="about"
              rows={14}
              maxLength={12000}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
              placeholder={`Example structure (replace with your facts):\n\nMasrJobs Demo NGO works with communities in Upper Egypt on youth skills and micro-enterprise.\n\nWe regularly advertise consultancy, programme, and MEAL roles. Most positions are based in Assiut with occasional travel.\n\nWe are an equal-opportunity employer; Arabic and English are used in the workplace.`}
            />
            <p className="mt-1 text-xs text-foreground/55 tabular-nums">
              {about.length.toLocaleString()} / 12,000 characters
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="org-location" className="block text-sm font-semibold text-brand-navy">
                Headquarters or primary location
              </label>
              <input
                id="org-location"
                name="location"
                type="text"
                maxLength={200}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="e.g. Cairo, Egypt · hybrid with field visits"
              />
            </div>
            <div>
              <label htmlFor="org-website" className="block text-sm font-semibold text-brand-navy">
                Official website
              </label>
              <input
                id="org-website"
                name="website"
                type="url"
                inputMode="url"
                maxLength={500}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="https://www.example.org"
              />
              <p className="mt-1 text-xs text-foreground/55">Must start with https://</p>
            </div>
            <div>
              <label htmlFor="org-phone" className="block text-sm font-semibold text-brand-navy">
                Main switchboard (optional)
              </label>
              <input
                id="org-phone"
                name="phone"
                type="tel"
                maxLength={40}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="+20 …"
              />
            </div>
          </div>

          {msg ? (
            <p
              className={`text-sm ${msg.startsWith("Profile saved") ? "text-emerald-800" : "text-red-700"}`}
              role={msg.startsWith("Profile saved") ? "status" : "alert"}
            >
              {msg}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              {saving ? "Saving…" : "Save public profile"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void load()}
              className="inline-flex rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              Reload from server
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
