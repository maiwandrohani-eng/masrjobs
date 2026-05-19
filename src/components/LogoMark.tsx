import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  height?: number;
  width?: number;
};

/** Site logo from /public/logo.png (black canvas; multiply blends on light backgrounds). */
export function LogoMark({ className, height = 92, width = 280 }: LogoMarkProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/logo.png"
        alt="MasrJobs.org"
        width={width}
        height={height}
        className="h-10 w-auto mix-blend-multiply sm:h-11 md:h-12"
        priority
      />
    </span>
  );
}
