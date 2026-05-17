export type ImpactLocale = "en" | "ar";

export const IMPACT_TRANSLATIONS = {
  en: {
    eyebrow: "MasrJobs.org",
    title: "Transparency & principles",
    description:
      "We want MasrJobs.org to be a calm, trustworthy place to find serious roles — for candidates and for mission-driven employers.",
    commitmentsHeading: "Our commitments",
    commitment1: "Every listing is reviewed by a human before publication.",
    commitment2:
      "We do not accept listings from organizations with open safeguarding violations or fraud allegations.",
    commitment3:
      "Listings with false deadlines or closed roles are removed within 24 hours of being reported.",
    commitment4: "We do not sell applicant data to third parties.",
    verificationHeading: "How verification works",
    verificationBody:
      "MasrJobs uses a two-stage review process. First, every organization account is verified by the admin team before the organization can post anything. Second, every individual listing is reviewed for quality and fit before it appears publicly. This means nothing on MasrJobs is unreviewed — not the employer, not the role.",
    optimizeHeading: "What we optimize for",
    optimize1Label: "Clarity",
    optimize1:
      " — candidates should understand role, location, and how to apply without hunting through attachments.",
    optimize2Label: "Fair process",
    optimize2:
      " — published listings should reflect what the organization intends to recruit for, with deadlines that respect applicants' time.",
    optimize3Label: "Verified employers",
    optimize3:
      " — organization accounts go through review so the directory is not a free-for-all.",
    growingHeading: "Growing with the sector",
    growingBefore:
      "Metrics and partner stories will expand as the platform matures. For now, the best signal is the quality of listings and the organizations choosing to post here. If you have ideas for accountability or reporting you would like to see published, reach us via",
    growingContactLabel: "Contact",
    growingAfter: ".",
  },
  ar: {
    eyebrow: "MasrJobs.org",
    title: "الشفافية والمبادئ",
    description:
      "نريد أن تكون MasrJobs.org مكاناً هادئاً وجديراً بالثقة للعثور على أدوار جادة — للمرشحين وأصحاب العمل ذوي الرسالة.",
    commitmentsHeading: "التزاماتنا",
    commitment1: "يراجع إنسان كل إعلان قبل نشره.",
    commitment2:
      "لا نقبل إعلانات من مؤسسات لديها انتهاكات حماية مفتوحة أو اتهامات بالاحتيال.",
    commitment3:
      "تُزال الإعلانات ذات المواعيد النهائية الكاذبة أو الأدوار المُغلقة في غضون 24 ساعة من الإبلاغ عنها.",
    commitment4: "لا نبيع بيانات المتقدمين لأطراف ثالثة.",
    verificationHeading: "كيف تعمل عملية التحقق",
    verificationBody:
      "تعتمد MasrJobs عملية مراجعة من مرحلتين. أولاً، يتحقق فريق الإدارة من كل حساب مؤسسة قبل أن تتمكن من نشر أي شيء. ثانياً، يُراجَع كل إعلان على حدة للتحقق من جودته وملاءمته قبل أن يظهر للعموم. هذا يعني أنه لا شيء على MasrJobs غير مُراجَع — لا صاحب العمل، ولا الوظيفة.",
    optimizeHeading: "ما نسعى إلى تحقيقه",
    optimize1Label: "الوضوح",
    optimize1:
      " — يجب أن يفهم المرشحون طبيعة الدور وموقعه وطريقة التقديم دون الحاجة إلى البحث في المرفقات.",
    optimize2Label: "العدالة في العملية",
    optimize2:
      " — يجب أن تعكس الإعلانات المنشورة ما تعتزم المؤسسة التوظيف له، مع مواعيد نهائية تحترم وقت المتقدمين.",
    optimize3Label: "التحقق من أصحاب العمل",
    optimize3:
      " — تخضع حسابات المؤسسات للمراجعة حتى لا يكون الدليل مفتوحاً للجميع دون رقابة.",
    growingHeading: "النمو مع القطاع",
    growingBefore:
      "ستتوسع المقاييس وقصص الشركاء مع نضج المنصة. في الوقت الراهن، أفضل مؤشر هو جودة الإعلانات والمنظمات التي تختار النشر هنا. إذا كانت لديك أفكار حول المساءلة أو التقارير التي تودّ نشرها، تواصل معنا عبر",
    growingContactLabel: "صفحة التواصل",
    growingAfter: ".",
  },
} as const;

export type ImpactTranslationKey = keyof (typeof IMPACT_TRANSLATIONS)["en"];
