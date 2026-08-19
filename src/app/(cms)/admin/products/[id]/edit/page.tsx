import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <div className="mb-6">
        <Link href="/admin/products" className="text-xs text-orange-600 font-semibold hover:underline">
          Back to products
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Edit product</h1>
        <p className="text-slate-500 text-sm mt-0.5">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
