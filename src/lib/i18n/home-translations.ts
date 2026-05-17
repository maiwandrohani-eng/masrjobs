export type HomeLocale = "en" | "ar";

export const HOME_TRANSLATIONS = {
  en: {
    // Hero
    heroLine1:
      "Find verified NGO jobs, consultancies, and grants in Egypt's development sector.",
    heroLine2:
      "Post your opening and reach professionals who are already here for this work.",
    heroTrust: "Every employer verified. Every listing reviewed.",
    ctaPrimary: "Browse opportunities",
    ctaSecondary: "Post a listing →",
    // Newsletter
    newsletterHeading: "Get new opportunities in your inbox every week.",
    newsletterSubtext: "No spam — only what's posted on MasrJobs.",
    newsletterButton: "Subscribe",
    // Employer CTA
    employerHeading: "Are you hiring?",
    employerBody:
      "MasrJobs.org is built for Egypt's NGO ecosystem. Post your listing and reach professionals who are already here.",
    employerButton: "Post a listing →",
    employerSupport:
      "Every organization account and every listing is individually reviewed before going live.",
    // Navigation
    navOpportunities: "Opportunities",
    navOrganizations: "Organizations",
    navResources: "Resources",
    navHowItWorks: "How it works",
    navAbout: "About",
    navContact: "Contact",
    navDashboard: "Dashboard",
    navLogin: "Log in",
    navRegister: "Create account",
    navOpenMenu: "Open menu",
    navCloseMenu: "Close menu",
    // Utilities
    backToHome: "Back to home",
  },
  ar: {
    // Hero
    heroLine1:
      "ابحث عن وظائف المنظمات غير الحكومية والاستشارات والمنح في قطاع التنمية في مصر.",
    heroLine2:
      "انشر فرصتك وتواصل مع المتخصصين الموجودين هنا لهذا العمل.",
    heroTrust: "كل صاحب عمل موثَّق. كل إعلان مُراجَع.",
    ctaPrimary: "تصفح الفرص",
    ctaSecondary: "انشر إعلاناً",
    // Newsletter
    newsletterHeading: "احصل على الفرص الجديدة في بريدك الإلكتروني كل أسبوع.",
    newsletterSubtext: "بدون إزعاج — فقط ما يُنشر على MasrJobs.",
    newsletterButton: "اشترك",
    // Employer CTA
    employerHeading: "هل تبحث عن موظفين؟",
    employerBody:
      "MasrJobs.org مبني لمنظومة المنظمات غير الحكومية في مصر. انشر فرصتك وتواصل مع المتخصصين.",
    employerButton: "انشر إعلاناً",
    employerSupport:
      "يخضع كل حساب مؤسسة وكل إعلان للمراجعة الفردية قبل النشر.",
    // Navigation
    navOpportunities: "الفرص",
    navOrganizations: "المنظمات",
    navResources: "المصادر",
    navHowItWorks: "كيف يعمل",
    navAbout: "حول المنصة",
    navContact: "تواصل معنا",
    navDashboard: "لوحة التحكم",
    navLogin: "تسجيل الدخول",
    navRegister: "إنشاء حساب",
    navOpenMenu: "فتح القائمة",
    navCloseMenu: "إغلاق القائمة",
    // Utilities
    backToHome: "العودة إلى الرئيسية",
  },
} as const;

export type HomeTranslationKey = keyof (typeof HOME_TRANSLATIONS)["en"];
