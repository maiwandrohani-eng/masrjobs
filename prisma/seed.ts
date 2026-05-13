/**
 * Neon bootstrap data. Run: `npx prisma db seed` (requires DATABASE_URL).
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const IDS = {
  catNgo: "seed_cat_ngo_jobs",
  catConsult: "seed_cat_consultancies",
  catTrain: "seed_cat_trainings",
  catVol: "seed_cat_volunteer_roles",
  catTender: "seed_cat_tenders",
  catGrant: "seed_cat_grants",
  orgErc: "seed_org_erc",
  orgCare: "seed_org_care",
  orgStc: "seed_org_stc",
  orgUndp: "seed_org_undp",
  userAdmin: "seed_user_admin",
  userOrgCare: "seed_user_org_care",
  userApplicant: "seed_user_applicant",
  oppYouth: "seed_opp_youth_prog",
  oppComm: "seed_opp_comm_erc",
  oppEval: "seed_opp_eval_plan",
  oppOd: "seed_opp_od_stc",
  oppPmp: "seed_opp_pmp_undp",
  oppSafe: "seed_opp_safe_care",
} as const;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required for seed.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const pass = await hash("MasrjobsSeedPass123", 12);

  await prisma.$transaction(async (tx) => {
    await tx.adminActionLog.deleteMany();
    await tx.newsletterSubscription.deleteMany();
    await tx.siteSetting.deleteMany();
    await tx.passwordResetToken.deleteMany();
    await tx.externalApplyIntent.deleteMany();
    await tx.application.deleteMany();
    await tx.savedOpportunity.deleteMany();
    await tx.featuredOpportunity.deleteMany();
    await tx.organizationProfileChange.deleteMany();
    await tx.opportunityAttachment.deleteMany();
    await tx.notification.deleteMany();
    await tx.opportunity.deleteMany();
    await tx.user.deleteMany();
    await tx.organization.deleteMany();
    await tx.category.deleteMany();

    await tx.category.createMany({
      data: [
        {
          id: IDS.catNgo,
          nameEn: "Jobs",
          slug: "jobs",
        },
        {
          id: IDS.catConsult,
          nameEn: "Consultancies",
          slug: "consultancies",
        },
        {
          id: IDS.catTrain,
          nameEn: "Trainings",
          slug: "trainings",
        },
        {
          id: IDS.catVol,
          nameEn: "Volunteer Roles",
          slug: "volunteer-roles",
        },
        {
          id: IDS.catTender,
          nameEn: "Tenders",
          slug: "tenders",
        },
        {
          id: IDS.catGrant,
          nameEn: "Grants",
          slug: "grants",
        },
      ],
    });

    await tx.organization.createMany({
      data: [
        {
          id: IDS.orgErc,
          name: "Egyptian Red Crescent Society",
          slug: "egyptian-red-crescent",
          description:
            "Humanitarian organization delivering relief, health, and community resilience programmes across Egypt.",
          location: "Cairo",
          website: "https://www.example.org/erc",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          featuredBadge: true,
          profileCompleteness: 80,
        },
        {
          id: IDS.orgCare,
          name: "Care Egypt Foundation",
          slug: "care-egypt",
          description:
            "Development NGO focused on livelihoods, gender equality, and inclusive economic growth.",
          location: "Giza",
          website: "https://www.example.org/care-egypt",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          featuredBadge: true,
          profileCompleteness: 85,
        },
        {
          id: IDS.orgStc,
          name: "Save the Children Egypt",
          slug: "save-the-children-egypt",
          description:
            "Child rights and protection, education, and emergency response for vulnerable families.",
          location: "Cairo",
          website: "https://www.example.org/stc-egypt",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          featuredBadge: false,
          profileCompleteness: 75,
        },
        {
          id: IDS.orgUndp,
          name: "UNDP Egypt",
          slug: "undp-egypt",
          description:
            "UN development agency supporting national priorities on climate, governance, and innovation.",
          location: "Cairo",
          website: "https://www.example.org/undp-egypt",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          featuredBadge: true,
          profileCompleteness: 90,
        },
      ],
    });

    await tx.user.createMany({
      data: [
        {
          id: IDS.userAdmin,
          email: "admin@masrjobs.local",
          passwordHash: pass,
          role: "ADMIN",
          firstName: "Platform",
          lastName: "Admin",
        },
        {
          id: IDS.userOrgCare,
          email: "org@care.masrjobs.local",
          passwordHash: pass,
          role: "ORG_USER",
          firstName: "Org",
          lastName: "Manager",
          organizationId: IDS.orgCare,
        },
        {
          id: IDS.userApplicant,
          email: "applicant@masrjobs.local",
          passwordHash: pass,
          role: "INDIVIDUAL",
          firstName: "Test",
          lastName: "Applicant",
        },
      ],
    });

    const deadline = (isoDay: string) => new Date(isoDay + "T12:00:00.000Z");

    await tx.opportunity.createMany({
      data: [
        {
          id: IDS.oppYouth,
          slug: "programme-officer-youth-livelihoods",
          title: "Programme Officer — Youth Livelihoods",
          description:
            "You will support implementation of a multi-year livelihoods programme, ensuring alignment with donor requirements and community needs. Strong Arabic and English, and experience with INGO systems preferred.",
          requirements:
            "Bachelor’s in development studies or related field; 3+ years NGO experience; monitoring and reporting skills.",
          howToApply:
            "Apply through MasrJobs with CV and cover letter, or use the external link if your organization requires it.",
          location: "Minya",
          deadline: deadline("2026-06-15"),
          type: "Full-time",
          workArrangement: "HYBRID",
          compensation: "PAID",
          applyMode: "INTERNAL",
          status: "PUBLISHED",
          publishedAt: new Date(),
          organizationId: IDS.orgCare,
          categoryId: IDS.catNgo,
        },
        {
          id: IDS.oppComm,
          slug: "communications-specialist-erc",
          title: "Communications Specialist",
          description:
            "Develop content strategies, manage social channels, and support crisis communications in coordination with technical teams.",
          requirements:
            "Degree in communications or journalism; portfolio of NGO or media work; Arabic native, English fluent.",
          howToApply: "Submit CV, portfolio, and cover letter via the apply form on this listing.",
          location: "Cairo",
          deadline: deadline("2026-05-30"),
          type: "Full-time",
          workArrangement: "ONSITE",
          compensation: "PAID",
          applyMode: "APPLY_BY_EMAIL",
          applicationEmail: "careers@erc-demo.example.org",
          status: "PUBLISHED",
          publishedAt: new Date(),
          organizationId: IDS.orgErc,
          categoryId: IDS.catNgo,
        },
        {
          id: IDS.oppEval,
          slug: "midterm-evaluation-education-project",
          title: "Mid-term Evaluation — Education Project",
          description:
            "The assignment includes desk review, field visits, stakeholder interviews, and a final report with actionable recommendations.",
          requirements:
            "Advanced degree; 8+ years evaluation experience; proven work in education or child protection in MENA.",
          howToApply: "Send expression of interest, daily rate, and two sample evaluation reports.",
          location: "Alexandria & Beheira",
          deadline: deadline("2026-06-01"),
          type: "Consultancy",
          workArrangement: "HYBRID",
          compensation: "PAID",
          applyMode: "EXTERNAL_LINK",
          externalApplicationUrl: "https://www.example.org/plan-egypt/consultancies/apply",
          status: "PUBLISHED",
          publishedAt: new Date(),
          organizationId: IDS.orgCare,
          categoryId: IDS.catConsult,
        },
        {
          id: IDS.oppOd,
          slug: "organizational-development-consultant",
          title: "Organizational Development Consultant",
          description:
            "Work with leadership and HR to align policies with Egyptian law and international safeguarding standards.",
          requirements: "Legal or OD background; Arabic and English; prior NGO clients required.",
          howToApply: "Apply with technical proposal (max 5 pages) and financial offer.",
          location: "Remote (Egypt-based)",
          deadline: deadline("2026-05-25"),
          type: "Consultancy",
          workArrangement: "REMOTE",
          compensation: "PAID",
          applyMode: "INTERNAL",
          status: "PUBLISHED",
          publishedAt: new Date(),
          organizationId: IDS.orgStc,
          categoryId: IDS.catConsult,
        },
        {
          id: IDS.oppPmp,
          slug: "pmp-training-arabic-undp",
          title: "Project Management Professional (PMP) — Arabic",
          description:
            "Interactive sessions on scope, schedule, risk, and stakeholder management with NGO case studies and exam tips.",
          requirements: "Open to NGO and government staff; laptop required; intermediate English.",
          howToApply: "Register online; limited seats for subsidized NGO participants.",
          location: "Cairo",
          deadline: deadline("2026-06-10"),
          type: "Training",
          workArrangement: "ONSITE",
          compensation: "PAID",
          applyMode: "INTERNAL",
          status: "PUBLISHED",
          publishedAt: new Date(),
          organizationId: IDS.orgUndp,
          categoryId: IDS.catTrain,
        },
        {
          id: IDS.oppSafe,
          slug: "safeguarding-psea-workshop-assiut",
          title: "Safeguarding & PSEA Workshop",
          description:
            "Practical scenarios, referral pathways, and reporting aligned with CHS and donor standards.",
          requirements: "Targeted at partner organizations; certificate of attendance provided.",
          howToApply: "Nominate two participants per organization via the application form.",
          location: "Assiut",
          deadline: deadline("2026-05-28"),
          type: "Training",
          workArrangement: "ONSITE",
          compensation: "UNPAID",
          applyMode: "INTERNAL",
          status: "PUBLISHED",
          publishedAt: new Date(),
          organizationId: IDS.orgCare,
          categoryId: IDS.catTrain,
        },
      ],
    });

    await tx.featuredOpportunity.createMany({
      data: [
        { opportunityId: IDS.oppYouth, rank: 30 },
        { opportunityId: IDS.oppComm, rank: 20 },
        { opportunityId: IDS.oppPmp, rank: 10 },
      ],
    });

    await tx.notification.create({
      data: {
        userId: IDS.userApplicant,
        organizationId: IDS.orgCare,
        opportunityId: IDS.oppYouth,
        title: "Welcome to MasrJobs.org",
        message: "Your seeded test account can browse and apply to internal listings.",
        href: `/opportunities/${IDS.oppYouth}`,
      },
    });
  });

  console.log("Seed complete. Test logins (email / password):");
  console.log("  admin@masrjobs.local / MasrjobsSeedPass123");
  console.log("  org@care.masrjobs.local / MasrjobsSeedPass123");
  console.log("  applicant@masrjobs.local / MasrjobsSeedPass123");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
