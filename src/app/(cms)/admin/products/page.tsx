import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/lib/queries/cms";
import { ProductsTable } from "@/components/cms/products-table";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
