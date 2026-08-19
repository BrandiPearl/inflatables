import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsClient } from "./products-client";
import { getProducts, getCategories } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "Commercial Inflatables for Sale | Bounce Houses, Water Slides & More",
  description:
    "Browse our full catalog of commercial grade inflatables. Bounce houses, water slides, obstacle courses, combo units, and interactive games. Ships nationwide.",
  alternates: {
    canonical: "https://wonderlandinflatables.com/products",
  },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsClient products={products} categories={categories} />
    </Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container-wide py-10">
          <div className="h-8 w-64 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 rounded mt-2 animate-pulse" />
        </div>
      </div>
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-slate-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
                <div className="h-5 w-24 bg-slate-100 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
