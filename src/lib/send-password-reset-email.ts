/**
 * Optional Resend integration. Set RESEND_API_KEY and EMAIL_FROM in production.
 * @see https://resend.com/docs/send-with-node
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<{ ok: true } | { ok: false; status: number; body: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM?.trim() || "MasrJobs <onboarding@resend.dev>";
  if (!apiKey) {
    return { ok: false, status: 503, body: "RESEND_API_KEY is not configured." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your MasrJobs.org password",
      html: `<p>You requested a password reset for MasrJobs.org.</p>
<p><a href="${resetUrl}">Choose a new password</a> (link expires in 1 hour).</p>
<p>If you did not request this, you can ignore this email.</p>`,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, body: text.slice(0, 500) };
  }
  return { ok: true };
}
