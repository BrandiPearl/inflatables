import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Submit your inflatable order. We confirm freight and payment terms before you pay.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="bg-slate-50 min-h-[60vh]">
      <div className="container-wide py-10 lg:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-xl">
          Send your unit list and shipping details. A product specialist will confirm availability, freight, and payment terms.
        </p>
        <CheckoutForm />
      </div>
    </div>
  );
}
