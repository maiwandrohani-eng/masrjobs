export type SocialLink = { href: string; label: string; abbr: string };

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { href: "https://facebook.com/masrjobs", abbr: "f", label: "Facebook" },
  { href: "https://instagram.com/masrjobs", abbr: "◎", label: "Instagram" },
  { href: "https://x.com/masrjobs", abbr: "𝕏", label: "X" },
  { href: "https://linkedin.com/company/masrjobs", abbr: "in", label: "LinkedIn" },
  { href: "https://tiktok.com/@masrjobs", abbr: "♪", label: "TikTok" },
  { href: "https://youtube.com/@masrjobs", abbr: "▶", label: "YouTube" },
];

export const DEFAULT_CONTACT_CARD = {
  officeTitle: "Office",
  body: "Cairo, Egypt\nEmail: hello@masrjobs.org\nHours: Sun–Thu, 9:00–17:00 (EET)",
  mapEmbedUrl: "",
} as const;
