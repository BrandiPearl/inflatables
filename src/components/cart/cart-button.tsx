"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { count, ready } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} items` : "Cart"}
      className="relative btn-ghost p-2"
    >
      <ShoppingCart className="w-4.5 h-4.5" />
      {ready && count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
