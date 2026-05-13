import { emailFooterText } from "./resend";
import { escapeHtml, wrapEmailHtml } from "./layout";

function siteOrigin(): string {
  const raw =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (!raw) return "https://masrjobs.org";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://masrjobs.org";
  }
}

function cta(href: string, label: string): string {
  const safe = escapeHtml(href);
  const lb = escapeHtml(label);
  return `<p style="margin:24px 0 0 0;">
  <a href="${safe}" style="display:inline-block;padding:12px 22px;background:#c9a227;color:#0f172a;text-decoration:none;font-weight:700;border-radius:10px;font-size:14px;">${lb}</a>
</p>`;
}

/** Combined welcome + “email on file” after registration */
export function buildRegistrationEmail(displayName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const name = escapeHtml(displayName.trim() || "there");
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:22px;color:#0f172a;">Welcome to MasrJobs</h1>
    <p style="margin:0;">Hi ${name},</p>
    <p style="margin:16px 0 0 0;">Your account is ready. You can sign in anytime to browse opportunities, save roles, and apply when listings use MasrJobs internal applications.</p>
    <h2 style="margin:28px 0 8px 0;font-size:16px;color:#0f172a;">Email on your account</h2>
    <p style="margin:0;">We use this address as your login and for important account messages. If you did not create this account, please contact support.</p>
    ${cta(`${origin}/login`, "Sign in to MasrJobs")}
  `;
  const text = `Welcome to MasrJobs\n\nHi ${displayName.trim() || "there"},\n\nYour account is ready. Sign in: ${origin}/login\n\n${emailFooterText()}`;
  return {
    subject: "Welcome to MasrJobs.org",
    html: wrapEmailHtml(inner, "Your MasrJobs account is ready."),
    text,
  };
}

export function buildAccountVerificationEmail(displayName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const name = escapeHtml(displayName.trim() || "there");
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Confirm your email</h1>
    <p style="margin:0;">Hi ${name},</p>
    <p style="margin:16px 0 0 0;">This message confirms that this email address is active on MasrJobs.org. No further action is required.</p>
    ${cta(`${origin}/dashboard/user`, "Go to your dashboard")}
  `;
  const text = `Confirm your email — MasrJobs\n\nHi ${displayName.trim() || "there"},\n\nThis confirms this email is active on MasrJobs.org.\n\n${origin}/dashboard/user\n\n${emailFooterText()}`;
  return {
    subject: "Your MasrJobs.org email is confirmed",
    html: wrapEmailHtml(inner, "This email is linked to your MasrJobs account."),
    text,
  };
}

export function buildPasswordResetEmail(resetUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const safeUrl = escapeHtml(resetUrl);
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Reset your password</h1>
    <p style="margin:0;">We received a request to reset the password for your MasrJobs.org account.</p>
    <p style="margin:16px 0 0 0;">This link expires in one hour.</p>
    ${cta(resetUrl, "Choose a new password")}
    <p style="margin:24px 0 0 0;font-size:14px;color:#64748b;">If you did not request a reset, you can ignore this email.</p>
  `;
  const text = `Reset your MasrJobs password\n\nOpen: ${resetUrl}\n\nThis link expires in one hour.\n\n${emailFooterText()}`;
  return {
    subject: "Reset your MasrJobs.org password",
    html: wrapEmailHtml(inner, "Reset your MasrJobs password"),
    text,
  };
}

export function buildApplicationSubmittedEmail(params: {
  applicantName: string;
  opportunityTitle: string;
  organizationName: string;
}): { subject: string; html: string; text: string } {
  const an = escapeHtml(params.applicantName);
  const ot = escapeHtml(params.opportunityTitle);
  const on = escapeHtml(params.organizationName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Application received</h1>
    <p style="margin:0;">Hi ${an},</p>
    <p style="margin:16px 0 0 0;">Your application to <strong>${ot}</strong> at <strong>${on}</strong> has been submitted on MasrJobs.org.</p>
    <p style="margin:16px 0 0 0;">You can track status from your applicant dashboard.</p>
    ${cta(`${origin}/dashboard/user`, "View your applications")}
  `;
  const text = `Application received — MasrJobs\n\nHi ${params.applicantName},\n\nSubmitted: ${params.opportunityTitle} (${params.organizationName}).\n\n${origin}/dashboard/user\n\n${emailFooterText()}`;
  return {
    subject: `Application submitted: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your application was submitted."),
    text,
  };
}

export function buildApplicationSubmittedOrgEmail(params: {
  organizationName: string;
  opportunityTitle: string;
  applicantName: string;
  applicantEmail: string;
}): { subject: string; html: string; text: string } {
  const on = escapeHtml(params.organizationName);
  const ot = escapeHtml(params.opportunityTitle);
  const an = escapeHtml(params.applicantName);
  const ae = escapeHtml(params.applicantEmail);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">New internal application</h1>
    <p style="margin:0;">Hello ${on} team,</p>
    <p style="margin:16px 0 0 0;">Someone applied via MasrJobs internal apply for <strong>${ot}</strong>.</p>
    <ul style="margin:16px 0 0 0;padding-left:20px;">
      <li><strong>Applicant:</strong> ${an}</li>
      <li><strong>Email:</strong> ${ae}</li>
    </ul>
    ${cta(`${origin}/dashboard/organization`, "Open employer workspace")}
  `;
  const text = `New application — ${params.opportunityTitle}\n\nApplicant: ${params.applicantName} <${params.applicantEmail}>\n\n${origin}/dashboard/organization\n\n${emailFooterText()}`;
  return {
    subject: `New applicant: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "New internal application on MasrJobs."),
    text,
  };
}

export function buildOrganizationApprovedEmail(orgName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const o = escapeHtml(orgName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Organization approved</h1>
    <p style="margin:0;">Good news — <strong>${o}</strong> can now post opportunities on MasrJobs.org (subject to listing review).</p>
    ${cta(`${origin}/dashboard/organization`, "Go to organization dashboard")}
  `;
  const text = `Organization approved — MasrJobs\n\n${orgName} can post opportunities.\n\n${origin}/dashboard/organization\n\n${emailFooterText()}`;
  return {
    subject: "Your organization is approved on MasrJobs.org",
    html: wrapEmailHtml(inner, "Your organization can post on MasrJobs."),
    text,
  };
}

export function buildOrganizationRejectedEmail(orgName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const o = escapeHtml(orgName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Organization registration update</h1>
    <p style="margin:0;">Your registration for <strong>${o}</strong> was not approved for posting on MasrJobs.org at this time.</p>
    <p style="margin:16px 0 0 0;">If you believe this is a mistake, reply to your MasrJobs contact or reach out through the site contact form.</p>
    ${cta(`${origin}/contact`, "Contact MasrJobs")}
  `;
  const text = `Organization registration — MasrJobs\n\n${orgName} was not approved at this time.\n\n${origin}/contact\n\n${emailFooterText()}`;
  return {
    subject: "MasrJobs.org — organization registration update",
    html: wrapEmailHtml(inner, "Update on your organization registration."),
    text,
  };
}

export function buildOpportunityApprovedEmail(params: {
  opportunityTitle: string;
  organizationName: string;
}): { subject: string; html: string; text: string } {
  const t = escapeHtml(params.opportunityTitle);
  const o = escapeHtml(params.organizationName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Listing approved</h1>
    <p style="margin:0;"><strong>${t}</strong> for <strong>${o}</strong> is approved and published (or moving live) on MasrJobs.org.</p>
    ${cta(`${origin}/opportunities`, "View public opportunities")}
  `;
  const text = `Listing approved — MasrJobs\n\n${params.opportunityTitle} (${params.organizationName})\n\n${origin}/opportunities\n\n${emailFooterText()}`;
  return {
    subject: `Published: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your listing was approved."),
    text,
  };
}

export function buildOpportunityRejectedEmail(params: {
  opportunityTitle: string;
  organizationName: string;
}): { subject: string; html: string; text: string } {
  const t = escapeHtml(params.opportunityTitle);
  const o = escapeHtml(params.organizationName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Listing not approved</h1>
    <p style="margin:0;"><strong>${t}</strong> for <strong>${o}</strong> was not approved for public listing on MasrJobs.org.</p>
    <p style="margin:16px 0 0 0;">You can revise and resubmit from your employer workspace when posting is available.</p>
    ${cta(`${origin}/dashboard/organization`, "Employer workspace")}
  `;
  const text = `Listing not approved — MasrJobs\n\n${params.opportunityTitle}\n\n${origin}/dashboard/organization\n\n${emailFooterText()}`;
  return {
    subject: `Listing update: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your listing was not approved."),
    text,
  };
}

export function buildApplicationStatusUpdatedEmail(params: {
  opportunityTitle: string;
  organizationName: string;
  statusLabel: string;
}): { subject: string; html: string; text: string } {
  const t = escapeHtml(params.opportunityTitle);
  const o = escapeHtml(params.organizationName);
  const s = escapeHtml(params.statusLabel);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">Application status updated</h1>
    <p style="margin:0;">Your application to <strong>${t}</strong> at <strong>${o}</strong> is now: <strong>${s}</strong>.</p>
    ${cta(`${origin}/dashboard/user`, "View your dashboard")}
  `;
  const text = `Application status — MasrJobs\n\n${params.opportunityTitle} (${params.organizationName})\nNew status: ${params.statusLabel}\n\n${origin}/dashboard/user\n\n${emailFooterText()}`;
  return {
    subject: `Application update: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your application status changed."),
    text,
  };
}
