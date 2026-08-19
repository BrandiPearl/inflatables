import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { getAdminProducts } from "@/lib/queries/cms";
import { ProductsTable } from "@/components/cms/products-table";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in your catalog`}
        actions={
          <Link href="/admin/products/new" className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Add product
          </Link>
        }
      />
      <ProductsTable products={products} />
    </div>
  );
}
