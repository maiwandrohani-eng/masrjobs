"use client";

import { ViewModeToggle } from "@/components/ViewModeToggle";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { cn } from "@/lib/cn";

export type ResourceArticle = {
  title: string;
  excerpt: string;
  category: string;
};

function ReadMoreButton({ articleTitle }: { articleTitle: string }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:min-h-0"
      aria-label={`Read more: ${articleTitle} (full article coming soon)`}
      title="Full article will be available when the CMS is connected"
    >
      Read more
    </button>
  );
}

export function ResourcesArticles({ articles }: { articles: ResourceArticle[] }) {
  const { mode, setMode } = usePersistedViewMode("masrjobs:v1:viewResourcesArticles");

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-brand-navy">{articles.length}</span> articles
        </p>
        <ViewModeToggle
          value={mode}
          onChange={setMode}
          groupAriaLabel="Resources article layout"
          className="self-stretch sm:self-auto"
        />
      </div>

      {mode === "card" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((a) => (
            <article
              key={a.title}
              className="flex h-full flex-col rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {a.category}
              </p>
              <h2 className="mt-1 text-lg font-bold text-brand-navy">{a.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{a.excerpt}</p>
              <div className="mt-5">
                <ReadMoreButton articleTitle={a.title} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-white shadow-sm">
          {articles.map((a) => (
            <li
              key={a.title}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  {a.category}
                </p>
                <h2 className="mt-0.5 text-base font-bold text-brand-navy">{a.title}</h2>
                <p className="mt-1 text-sm text-foreground/75">{a.excerpt}</p>
              </div>
              <div className={cn("flex shrink-0 sm:items-center")}>
                <ReadMoreButton articleTitle={a.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
