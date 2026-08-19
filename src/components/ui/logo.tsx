import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizes = {
  sm: { mark: 32, text: "text-[1.0625rem]", sub: "text-[0.5625rem]" },
  md: { mark: 38, text: "text-xl", sub: "text-[0.625rem]" },
  lg: { mark: 46, text: "text-2xl", sub: "text-[0.6875rem]" },
};

export function Logo({
  variant = "default",
  size = "md",
  showText = true,
  className,
  href = "/",
}: LogoProps) {
  const { mark, text, sub } = sizes[size];

  const textColor = variant === "light" ? "text-white" : "text-slate-900";
  const subColor = variant === "light" ? "text-white/45" : "text-slate-500";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={mark}
        height={mark}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <div className="leading-none">
          <div
            className={cn(
              "font-display display-wide font-extrabold tracking-[-0.03em]",
              text,
              textColor
            )}
          >
            Wonderland
          </div>
          <div
            className={cn(
              "mt-[3px] font-mono uppercase tracking-[0.24em]",
              sub,
              subColor
            )}
          >
            Inflatables
          </div>
        </div>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="flex-shrink-0" aria-label="Wonderland Inflatables home">
      {content}
    </Link>
  );
}
