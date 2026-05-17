export type HowItWorksLocale = "en" | "ar";

export const HOW_IT_WORKS_TRANSLATIONS = {
  en: {
    eyebrow: "Guides",
    title: "How MasrJobs.org works",
    description:
      "A short map of the platform so you know what to expect — whether you are applying, hiring, or browsing the directory.",
    applicantsHeading: "For applicants",
    applicant1Before: "Browse published opportunities, save listings, and track applications from your",
    applicant1LinkLabel: "applicant dashboard",
    applicant1After: ".",
    applicant2: "All listings are reviewed by the MasrJobs team before going live.",
    applicant3Before: "Some roles use",
    applicant3Bold: "internal apply",
    applicant3After:
      "on MasrJobs.org; others use email or an external link — the listing always states which path to use.",
    checklistLink: "Internal application checklist →",
    employersHeading: "For employers",
    employer1:
      "Register your organization — create an account and submit your organization profile for admin review.",
    employer2:
      "Account approved — once verified by the MasrJobs team, you gain access to your employer dashboard and can submit listings.",
    employer3:
      "Each listing reviewed — every listing you submit is individually reviewed for quality and fit before it appears publicly on the platform.",
    employerTwoStage:
      "This two-stage process means every organization and every listing on MasrJobs has been individually reviewed before any applicant sees it.",
    employer48h:
      "Most listings are reviewed within 48 hours of submission. You will receive a confirmation email when your listing is live.",
    postingGuidelinesLink: "Posting guidelines for faster approval →",
    trustHeading: "Trust & directory",
    trustBefore: "The",
    trustLinkLabel: "organization directory",
    trustAfter:
      "highlights verified employers. Badges and filters help you scan quickly before you open a full listing.",
    exploreHeading: "Explore more",
    exploreSectors: "Browse by theme / category",
    exploreEvents: "Events & key dates",
    exploreSpotlights: "Employer spotlights",
    exploreImpact: "Transparency & principles",
  },
  ar: {
    eyebrow: "أدلة المنصة",
    title: "كيف تعمل MasrJobs.org",
    description:
      "خريطة موجزة للمنصة حتى تعرف ما تتوقعه — سواء كنت تتقدم لوظيفة، أو توظِّف، أو تتصفح الدليل.",
    applicantsHeading: "للمتقدمين",
    applicant1Before: "تصفَّح الفرص المنشورة، واحفظ الإعلانات، وتابع طلباتك من",
    applicant1LinkLabel: "لوحة تحكم المتقدم",
    applicant1After: ".",
    applicant2: "تُراجَع جميع الإعلانات من قِبل فريق MasrJobs قبل نشرها.",
    applicant3Before: "تستخدم بعض الأدوار",
    applicant3Bold: "التقديم الداخلي",
    applicant3After:
      "عبر MasrJobs.org، وتستخدم أخرى البريد الإلكتروني أو رابطاً خارجياً — يوضح الإعلان دائماً الطريقة المتَّبعة.",
    checklistLink: "قائمة التحقق للتقديم الداخلي",
    employersHeading: "لأصحاب العمل",
    employer1:
      "سجِّل مؤسستك — أنشئ حساباً وأرسل ملف مؤسستك لمراجعة فريق الإدارة.",
    employer2:
      "الحساب معتمَد — بمجرد التحقق من هويتك بواسطة فريق MasrJobs، تحصل على إمكانية الوصول إلى لوحة تحكم صاحب العمل وتستطيع إرسال إعلاناتك.",
    employer3:
      "كل إعلان يُراجَع — يخضع كل إعلان تقدمه للمراجعة الفردية للتحقق من جودته وملاءمته قبل أن يظهر على المنصة.",
    employerTwoStage:
      "تعني هذه العملية المكوَّنة من مرحلتين أن كل مؤسسة وكل إعلان على MasrJobs قد خضع للمراجعة الفردية قبل أن يراه أي متقدم.",
    employer48h:
      "تُراجَع معظم الإعلانات في غضون 48 ساعة من تقديمها. ستتلقى بريداً إلكترونياً تأكيدياً حين يصبح إعلانك منشوراً.",
    postingGuidelinesLink: "إرشادات النشر للحصول على موافقة أسرع",
    trustHeading: "الثقة والدليل",
    trustBefore: "",
    trustLinkLabel: "دليل المنظمات",
    trustAfter:
      "يبرز أصحاب العمل الموثَّقين. تساعدك الشارات والمرشحات على الفرز السريع قبل فتح أي إعلان كامل.",
    exploreHeading: "استكشف المزيد",
    exploreSectors: "تصفح حسب الموضوع / التصنيف",
    exploreEvents: "الفعاليات والتواريخ الرئيسية",
    exploreSpotlights: "أضواء على أصحاب العمل",
    exploreImpact: "الشفافية والمبادئ",
  },
} as const;

export type HowItWorksTranslationKey = keyof (typeof HOW_IT_WORKS_TRANSLATIONS)["en"];
