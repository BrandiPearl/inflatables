import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutSuccess } from "./success-client";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-white min-h-[60vh]">
      <div className="container-wide py-16 max-w-lg mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5 mx-auto">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Order request received</h1>
        <Suspense>
          <CheckoutSuccess />
        </Suspense>
        <p className="mt-3 text-slate-500 text-sm">
          We emailed you a confirmation. Next we will review availability and freight, then follow up with payment terms. Most orders get a reply within 2 business hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="btn-primary text-sm py-2.5 px-5">
            Continue shopping
          </Link>
          <Link href="/contact" className="btn-secondary text-sm py-2.5 px-5">
            Contact sales
          </Link>
        </div>
      </div>
    </div>
  );
}
