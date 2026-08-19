import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "green" | "slate" | "red";
  className?: string;
}

export function Badge({ children, variant = "slate", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "orange" && "bg-orange-100 text-orange-700",
        variant === "green" && "bg-emerald-50 text-emerald-700",
        variant === "red" && "bg-red-100 text-red-700",
        variant === "slate" && "bg-slate-100 text-slate-700",
        className
      )}
    >
      {children}
    </span>
  );
}
