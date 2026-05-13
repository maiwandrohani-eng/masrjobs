"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-brand-navy">Name</label>
          <input
            required
            name="name"
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-brand-navy">Email</label>
          <input
            required
            type="email"
            name="email"
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-brand-navy">Subject</label>
          <input
            required
            name="subject"
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-brand-navy">Message</label>
          <textarea
            required
            name="message"
            rows={5}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-brand-navy py-3 text-sm font-semibold text-white hover:opacity-95 sm:w-auto sm:px-10"
      >
        Send message
      </button>
      {sent ? (
        <p className="mt-4 text-sm font-medium text-brand-navy">
          Thank you — this demo form captured your message locally. In production this
          would email the MasrJobs.org team or create a support ticket.
        </p>
      ) : null}
    </form>
  );
}
