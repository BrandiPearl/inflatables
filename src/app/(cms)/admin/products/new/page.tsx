import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/cms/product-form";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-xs text-orange-600 font-semibold hover:underline">
          Back to products
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Add Product</h1>
        <p className="text-slate-500 text-sm mt-0.5">Create a catalog item with photos, specs, and pricing.</p>
      </div>
      <ProductForm />
    </div>
  );
}
