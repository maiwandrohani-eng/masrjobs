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
        className={cn(
          "h-8 w-auto max-w-[9rem] sm:h-9 sm:max-w-[10rem] lg:h-10 lg:max-w-[11rem] xl:h-11 xl:max-w-[12rem]",
          className,
        )}
        priority
      />
    </span>
  );
}
