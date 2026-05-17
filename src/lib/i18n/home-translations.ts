// TODO: extend Arabic translations to remaining pages

export type HomeLocale = "en" | "ar";

export const HOME_TRANSLATIONS = {
  en: {
    heroLine1:
      "Find verified NGO jobs, consultancies, and grants in Egypt's development sector.",
    heroLine2:
      "Post your opening and reach professionals who are already here for this work.",
    heroTrust: "Every employer verified. Every listing reviewed.",
    ctaPrimary: "Browse opportunities",
    ctaSecondary: "Post a listing →",
    newsletterHeading: "Get new opportunities in your inbox every week.",
    newsletterSubtext: "No spam — only what's posted on MasrJobs.",
    newsletterButton: "Subscribe",
    employerHeading: "Are you hiring?",
    employerBody:
      "MasrJobs.org is built for Egypt's NGO ecosystem. Post your listing and reach professionals who are already here.",
    employerButton: "Post a listing →",
    employerSupport:
      "Every organization account and every listing is individually reviewed before going live.",
  },
  ar: {
    heroLine1:
      "ابحث عن وظائف المنظمات غير الحكومية والاستشارات والمنح في قطاع التنمية في مصر.",
    heroLine2:
      "انشر فرصتك وتواصل مع المتخصصين الموجودين هنا لهذا العمل.",
    heroTrust: "كل صاحب عمل موثّق. كل إعلان مراجعة.",
    ctaPrimary: "تصفح الفرص",
    ctaSecondary: "انشر إعلاناً",
    newsletterHeading: "احصل على الفرص الجديدة في بريدك الإلكتروني كل أسبوع.",
    newsletterSubtext: "بدون إزعاج — فقط ما يُنشر على MasrJobs.",
    newsletterButton: "اشترك",
    employerHeading: "هل تبحث عن موظفين؟",
    employerBody:
      "MasrJobs.org مبني لمنظومة المنظمات غير الحكومية في مصر. انشر فرصتك وتواصل مع المتخصصين.",
    employerButton: "انشر إعلاناً",
    employerSupport:
      "Every organization account and every listing is individually reviewed before going live.",
  },
} as const;

export type HomeTranslationKey = keyof (typeof HOME_TRANSLATIONS)["en"];
