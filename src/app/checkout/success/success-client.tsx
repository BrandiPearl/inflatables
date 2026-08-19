"use client";

import { useSearchParams } from "next/navigation";

export function CheckoutSuccess() {
  const ref = useSearchParams().get("ref");
  if (!ref) return null;
  return <p className="mt-3 text-sm font-semibold text-orange-700">Reference {ref}</p>;
}
