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
        className="h-12 w-auto sm:h-14 md:h-[4.25rem]"
        priority
      />
    </span>
  );
}
