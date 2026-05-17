export type AboutLocale = "en" | "ar";

export const ABOUT_TRANSLATIONS = {
  en: {
    eyebrow: "About MasrJobs.org",
    title: "Egypt's Development & Social Impact Jobs Platform",
    description:
      "MasrJobs.org connects mission-driven talent with NGOs, development agencies, and social enterprises across Egypt — making it easier to find meaningful work and partnerships.",
    missionHeading: "Our mission",
    missionBody:
      "We believe Egypt's nonprofit and development sector grows stronger when opportunities are transparent, accessible, and trustworthy. MasrJobs.org aggregates roles across humanitarian response, sustainable development, education, climate resilience, gender equality, and more — in one bilingual-ready, mobile-friendly experience.",
    serveHeading: "Who we serve",
    serve1: "Professionals seeking NGO jobs, consultancies, and fellowships",
    serve2: "Students and graduates exploring trainings and volunteering",
    serve3: "Organizations recruiting vetted talent and publishing tenders or grants",
    serve4:
      "Egyptian and international organizations seeking to reach pre-vetted, mission-aligned candidates in Egypt.",
    qualityHeading: "Quality & moderation",
    qualityBody:
      "MasrJobs uses a two-stage review process. First, every organization account is verified by the admin team before the organization can post anything. Second, every individual listing is reviewed for quality and fit before it appears publicly. This means nothing on MasrJobs is unreviewed — not the employer, not the role.",
    builtHeading: "Who built this",
    builtPara1Before: "MasrJobs.org was founded by Maiwand Rohani, CEO of ",
    builtPara1After:
      " (International Network for Aid, Relief, and Assistance), with the support of volunteers from Egypt's NGO sector who contributed their time and expertise to build the platform.",
    builtPara2:
      "The platform grew out of a direct need observed through humanitarian and development work in Egypt — the absence of a single, trustworthy, sector-specific space where mission-driven professionals and organizations could find each other. MasrJobs is the answer to that gap.",
  },
  ar: {
    eyebrow: "حول MasrJobs.org",
    title: "منصة وظائف التنمية والتأثير الاجتماعي في مصر",
    description:
      "تربط MasrJobs.org المواهب ذات الرسالة بالمنظمات غير الحكومية ووكالات التنمية والمشاريع الاجتماعية في مصر — مما يسهّل إيجاد العمل الهادف وبناء الشراكات.",
    missionHeading: "مهمتنا",
    missionBody:
      "نؤمن بأن قطاع المنظمات غير الربحية وقطاع التنمية في مصر يزداد قوةً حين تكون الفرص شفافة وسهلة الوصول وجديرة بالثقة. تجمع MasrJobs.org الأدوار في مجالات الاستجابة الإنسانية، والتنمية المستدامة، والتعليم، والصمود المناخي، والمساواة بين الجنسين، وغيرها — في تجربة واحدة متعددة اللغات ومناسبة للجوال.",
    serveHeading: "من نخدم",
    serve1: "المحترفون الباحثون عن وظائف في المنظمات غير الحكومية والاستشارات والزمالات",
    serve2: "الطلاب والخريجون الراغبون في استكشاف برامج التدريب والتطوع",
    serve3: "المنظمات الساعية إلى استقطاب الكفاءات المُدقَّقة ونشر المناقصات والمنح",
    serve4:
      "المنظمات المصرية والدولية الراغبة في الوصول إلى مرشحين مُدقَّقين مسبقاً ومنسجمين مع رسالتها في مصر.",
    qualityHeading: "الجودة والإشراف",
    qualityBody:
      "تعتمد MasrJobs عملية مراجعة من مرحلتين. أولاً، يتحقق فريق الإدارة من كل حساب مؤسسة قبل أن تتمكن من نشر أي شيء. ثانياً، يُراجَع كل إعلان على حدة للتحقق من جودته وملاءمته قبل أن يظهر للعموم. هذا يعني أنه لا شيء على MasrJobs غير مُراجَع — لا صاحب العمل، ولا الوظيفة.",
    builtHeading: "من بنى هذه المنصة",
    builtPara1Before: "أسَّس MasrJobs.org ميواند روهاني، الرئيس التنفيذي لـ ",
    builtPara1After:
      " (الشبكة الدولية للإغاثة والمساعدة)، بدعم من متطوعين من القطاع غير الحكومي في مصر أسهموا بوقتهم وخبراتهم في بناء المنصة.",
    builtPara2:
      "نبعت المنصة من حاجة مباشرة رُصِدت من خلال العمل الإنساني والتنموي في مصر — غياب فضاء واحد موثوق ومتخصص يتيح للمحترفين والمنظمات ذوي الرسالة إيجاد بعضهم. MasrJobs هو الإجابة على هذا الفراغ.",
  },
} as const;

export type AboutTranslationKey = keyof (typeof ABOUT_TRANSLATIONS)["en"];
