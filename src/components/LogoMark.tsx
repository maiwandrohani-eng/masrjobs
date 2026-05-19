import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  height?: number;
  width?: number;
};

/** Transparent site logo from /public/logo.png */
export function LogoMark({ className, height = 100, width = 280 }: LogoMarkProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/logo.png"
        alt="MasrJobs.org"
        width={width}
        height={height}
        className="h-9 w-auto max-w-[10.5rem] sm:h-10 sm:max-w-[11.5rem] lg:h-11 lg:max-w-[13rem] xl:h-[4.25rem] xl:max-w-none"
        priority
      />
    </span>
  );
}
