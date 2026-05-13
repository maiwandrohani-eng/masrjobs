import type { ContactPublicData } from "@/lib/site-contact";

function isSafeMapEmbedUrl(url: string): boolean {
  const t = url.trim();
  if (!t.startsWith("https://")) return false;
  if (t.length > 2048) return false;
  try {
    const u = new URL(t);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function ContactSidebar({ data }: { data: ContactPublicData }) {
  const showMap = data.mapEmbedUrl && isSafeMapEmbedUrl(data.mapEmbedUrl);

  return (
    <aside className="space-y-4 rounded-2xl border border-brand-border bg-brand-muted/50 p-6">
      <h2 className="text-sm font-bold text-brand-navy">{data.officeTitle}</h2>
      <p className="whitespace-pre-line text-sm text-foreground/75">{data.body}</p>
      {showMap ? (
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white">
          <iframe
            title="Map"
            src={data.mapEmbedUrl.trim()}
            className="aspect-video w-full min-h-[200px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      ) : null}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-brand-navy">Social</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {data.social.map((s) => (
            <a
              key={s.href}
              className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
