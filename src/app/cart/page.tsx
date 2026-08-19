import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the commercial inflatables in your cart before checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="bg-slate-50 min-h-[60vh]">
      <div className="container-wide py-10 lg:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Your cart</h1>
        <CartView />
      </div>
    </div>
  );
}
