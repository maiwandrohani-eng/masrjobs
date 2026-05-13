import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  height?: number;
  width?: number;
};

/** Transparent logo — no background; tuned for clear visibility in the navbar and on the homepage. */
export function LogoMark({ className, height = 100, width = 280 }: LogoMarkProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/logo.jpg"
        alt="MasrJobs.org"
        width={width}
        height={height}
        className="h-14 w-auto sm:h-16 md:h-[4.75rem]"
        priority
      />
    </span>
  );
}
