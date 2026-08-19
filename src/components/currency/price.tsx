"use client";

import { useCurrency } from "@/components/currency/currency-provider";
import { cn } from "@/lib/utils";

export function Price({
  amount,
  className,
  original,
}: {
  amount: number;
  className?: string;
  original?: boolean;
}) {
  const { format } = useCurrency();
  return <span className={cn(original && "line-through", className)}>{format(amount)}</span>;
}
