import { cn } from "@/lib/utils";

interface ProductImagePlaceholderProps {
  name?: string;
  category?: string;
  className?: string;
}

/**
 * Stands in for missing catalogue photography. Kept deliberately plain — a
 * ruled bone panel with the initials set in mono, in the manner of an
 * unphotographed line item in a printed catalogue. No tinted gradients.
 */
export function ProductImagePlaceholder({
  name = "Product",
  category = "other",
  className,
}: ProductImagePlaceholderProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center bg-slate-100",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(27,23,18,0.045) 0 1px, transparent 1px 9px)",
      }}
    >
      <span className="font-display display-wide text-4xl font-extrabold tracking-tight text-slate-300">
        {initials}
      </span>
      <span className="spec mt-2.5 text-[0.5625rem] uppercase tracking-[0.2em] text-slate-400">
        {category.replace(/-/g, " ")}
      </span>
    </div>
  );
}
