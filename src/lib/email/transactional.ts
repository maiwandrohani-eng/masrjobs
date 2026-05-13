import { sendEmail, type SendEmailResult } from "./resend";
import {
  buildAccountVerificationEmail,
  buildApplicationStatusUpdatedEmail,
  buildApplicationSubmittedEmail,
  buildApplicationSubmittedOrgEmail,
  buildOpportunityApprovedEmail,
  buildOpportunityRejectedEmail,
  buildOrganizationApprovedEmail,
  buildOrganizationRejectedEmail,
  buildPasswordResetEmail,
  buildRegistrationEmail,
} from "./templates";

/** Fire-and-forget with server-side logging; never throws to caller. */
export function queueTransactionalEmail(
  label: string,
  fn: () => Promise<void>,
): void {
  void (async () => {
    try {
      await fn();
    } catch (e) {
      console.error("[email] transactional failure:", label, e);
    }
  })();
}

export function sendRegistrationEmailBundle(to: string, displayName: string): void {
  queueTransactionalEmail("registration", async () => {
    const welcome = buildRegistrationEmail(displayName);
    const r1 = await sendEmail({ to, ...welcome });
    if (!r1.ok) console.error("[email] registration welcome failed", r1.error);
    const verify = buildAccountVerificationEmail(displayName);
    const r2 = await sendEmail({ to, ...verify });
    if (!r2.ok) console.error("[email] registration verify failed", r2.error);
  });
}

export async function sendPasswordResetEmailNow(
  to: string,
  resetUrl: string,
): Promise<SendEmailResult> {
  const body = buildPasswordResetEmail(resetUrl);
  return sendEmail({ to, ...body });
}

export function sendApplicationSubmittedBundle(params: {
  applicantEmail: string;
  applicantName: string;
  opportunityTitle: string;
  organizationName: string;
  orgNotifyEmail?: string | null;
}): void {
  queueTransactionalEmail("application-submitted", async () => {
    const app = buildApplicationSubmittedEmail({
      applicantName: params.applicantName,
      opportunityTitle: params.opportunityTitle,
      organizationName: params.organizationName,
    });
    const r1 = await sendEmail({ to: params.applicantEmail, ...app });
    if (!r1.ok) console.error("[email] applicant confirmation failed", r1.error);
    const orgTo = params.orgNotifyEmail?.trim();
    if (orgTo?.includes("@")) {
      const org = buildApplicationSubmittedOrgEmail({
        organizationName: params.organizationName,
        opportunityTitle: params.opportunityTitle,
        applicantName: params.applicantName,
        applicantEmail: params.applicantEmail,
      });
      const r2 = await sendEmail({ to: orgTo, ...org });
      if (!r2.ok) console.error("[email] org notify failed", r2.error);
    }
  });
}

export function sendOrganizationApprovedEmail(to: string, organizationName: string): void {
  queueTransactionalEmail("org-approved", async () => {
    const body = buildOrganizationApprovedEmail(organizationName);
    const r = await sendEmail({ to, ...body });
    if (!r.ok) console.error("[email] org approved failed", to, r.error);
  });
}

/** Sends the same approval confirmation to each unique address (org contact + all active org users). */
export function sendOrganizationApprovedEmailToAll(
  recipients: string[],
  organizationName: string,
): void {
  const seen = new Set<string>();
  for (const raw of recipients) {
    const e = raw.trim().toLowerCase();
    if (!e.includes("@") || seen.has(e)) continue;
    seen.add(e);
    sendOrganizationApprovedEmail(raw.trim(), organizationName);
  }
}

export function sendOrganizationRejectedEmail(to: string, organizationName: string): void {
  queueTransactionalEmail("org-rejected", async () => {
    const body = buildOrganizationRejectedEmail(organizationName);
    const r = await sendEmail({ to, ...body });
    if (!r.ok) console.error("[email] org rejected failed", r.error);
  });
}

export function sendOpportunityApprovedEmail(
  to: string,
  params: { opportunityTitle: string; organizationName: string },
): void {
  queueTransactionalEmail("opp-approved", async () => {
    const body = buildOpportunityApprovedEmail(params);
    const r = await sendEmail({ to, ...body });
    if (!r.ok) console.error("[email] opp approved failed", r.error);
  });
}

export function sendOpportunityRejectedEmail(
  to: string,
  params: { opportunityTitle: string; organizationName: string },
): void {
  queueTransactionalEmail("opp-rejected", async () => {
    const body = buildOpportunityRejectedEmail(params);
    const r = await sendEmail({ to, ...body });
    if (!r.ok) console.error("[email] opp rejected failed", r.error);
  });
}

export function sendApplicationStatusUpdatedEmail(
  to: string,
  params: {
    opportunityTitle: string;
    organizationName: string;
    statusLabel: string;
  },
): void {
  queueTransactionalEmail("app-status", async () => {
    const body = buildApplicationStatusUpdatedEmail(params);
    const r = await sendEmail({ to, ...body });
    if (!r.ok) console.error("[email] status update failed", r.error);
  });
}
