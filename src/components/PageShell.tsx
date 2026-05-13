import { cn } from "@/lib/cn";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-10", className)}>
      {children}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-foreground/75">
          {description}
        </p>
      ) : null}
    </header>
  );
}
