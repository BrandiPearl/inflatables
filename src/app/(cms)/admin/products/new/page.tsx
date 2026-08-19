import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { ProductForm } from "@/components/cms/product-form";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader
        backHref="/admin/products"
        backLabel="Back to products"
        title="Add product"
        description="Create a catalog item with photos, specs, and pricing."
      />
      <ProductForm />
    </div>
  );
}
