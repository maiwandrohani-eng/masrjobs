export type EventsLocale = "en" | "ar";

export const EVENTS_TRANSLATIONS = {
  en: {
    eyebrow: "Community",
    title: "Events & key dates",
    description: "Editorial calendar of sessions and seasonal hiring rhythms.",
    unconfirmedNotice:
      "Some events below are not yet confirmed. Check back or contact the organizer before registering.",
    unconfirmedBadge: "UNCONFIRMED",
    relatedLink: "Related link →",
    wantListedBefore: "Want something listed?",
    contactTeamLabel: "Contact the team",
    wantListedAfter: " with date, audience, and registration details.",
  },
  ar: {
    eyebrow: "المجتمع",
    title: "الفعاليات والتواريخ الرئيسية",
    description: "التقويم التحريري للجلسات وأنماط التوظيف الموسمية.",
    unconfirmedNotice:
      "بعض الفعاليات أدناه غير مؤكدة بعد. عد للتحقق أو تواصل مع المنظِّم قبل التسجيل.",
    unconfirmedBadge: "غير مؤكد",
    relatedLink: "رابط ذو صلة",
    wantListedBefore: "هل تريد إدراج فعالية؟",
    contactTeamLabel: "تواصل مع الفريق",
    wantListedAfter: " مع التاريخ والجمهور المستهدف وتفاصيل التسجيل.",
  },
} as const;

export type EventsTranslationKey = keyof (typeof EVENTS_TRANSLATIONS)["en"];
