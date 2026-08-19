import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ui/product-card";
import { ProductGallery } from "@/components/ui/product-gallery";
import { ProductBuyBox } from "@/components/cart/product-buy-box";
import { Price } from "@/components/currency/price";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { isUsableProductImage } from "@/lib/product-image";
import { descriptionParagraphs } from "@/lib/product-copy";
import {
  CheckCircle2,
  Package,
  Shield,
  Truck,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo?.title ?? product.name,
    description:
      product.seo?.description ?? product.short_description,
    alternates: {
      canonical: `https://wonderlandinflatables.com/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.images[0].alt }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.category, 3);
  const gallery = product.images.filter((img) => isUsableProductImage(img.url));
  const hero = gallery.find((img) => img.is_primary) ?? gallery[0];
  const paragraphs = descriptionParagraphs(product.description || product.short_description);

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
      )
    : 0;

  const specEntries = Object.entries(product.specs).filter(([, v]) => v);

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-slate-700 transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-slate-700 transition-colors capitalize"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Images */}
          <ProductGallery
            images={gallery}
            name={product.name}
            category={product.category}
            isNew={product.is_new}
          />

          {/* Product info */}
          <div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
              {product.category.replace(/-/g, " ")} · SKU: {product.sku}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              {product.short_description}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                <Price amount={product.price} />
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400">
                    <Price amount={product.compare_at_price!} original />
                  </span>
                  <span className="badge bg-red-100 text-red-700 text-sm">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">Shown in your local currency. Orders are quoted in USD.</p>

            {/* Stock status */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  product.in_stock ? "bg-emerald-500" : "bg-slate-300"
                )}
              />
              <span className={product.in_stock ? "text-emerald-700 font-medium" : "text-slate-500"}>
                {product.in_stock ? "In stock, ready to ship" : "Currently out of stock"}
              </span>
            </div>

            {/* CTA buttons */}
            <ProductBuyBox
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                sku: product.sku,
                price: product.price,
                image: gallery[0]?.url,
                in_stock: product.in_stock,
              }}
            />

            {/* Purchase assurances */}
            <dl className="mt-7 w-full border-t border-slate-200 pt-6">
              {[
                { icon: Shield, term: "Warranty", detail: "Commercial, 3 years" },
                { icon: Truck, term: "Freight", detail: "All 48 states" },
                { icon: Package, term: "In the crate", detail: "Blower, stakes, repair kit" },
              ].map(({ icon: Icon, term, detail }, i) => (
                <div
                  key={term}
                  className={`flex items-baseline gap-4 py-2.5 ${
                    i > 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <Icon
                    className="h-3.5 w-3.5 flex-shrink-0 translate-y-0.5 text-orange-600"
                    strokeWidth={1.75}
                  />
                  <dt className="spec w-28 flex-shrink-0 text-[0.625rem] uppercase tracking-[0.16em] text-slate-500">
                    {term}
                  </dt>
                  <dd className="text-[0.8125rem] text-slate-700">{detail}</dd>
                </div>
              ))}
            </dl>

            {/* Key features */}
            {product.features.length > 0 && (
              <div className="mt-7 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Key Features
                </h3>
                <ul className="m-0 list-none space-y-2 p-0">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {(paragraphs.length > 0 || specEntries.length > 0) && (
        <div className="mt-16 border-t border-slate-100 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {paragraphs.length > 0 && (
            <div className={specEntries.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Product Description
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                {paragraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </div>
            )}

            {specEntries.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Specifications
              </h2>
              <dl className="m-0">
                {specEntries.map(([key, val]) => (
                  <div key={key} className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
                    <dt className="text-sm text-slate-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-sm font-medium text-slate-900 text-right">
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            )}
          </div>
        </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-slate-100 pt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More in {product.category.replace(/-/g, " ")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.sku,
            image: hero?.url ? [hero.url] : undefined,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: product.in_stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `https://wonderlandinflatables.com/product/${product.slug}`,
            },
            brand: {
              "@type": "Brand",
              name: "Wonderland Inflatables",
            },
          }),
        }}
      />
    </div>
  );
}
