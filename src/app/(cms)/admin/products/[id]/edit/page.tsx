import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { ProductForm } from "@/components/cms/product-form";
import { getAdminProduct } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        backHref="/admin/products"
        backLabel="Back to products"
        title="Edit product"
        description={product.name}
      />
      <ProductForm product={product} />
    </div>
  );
}
