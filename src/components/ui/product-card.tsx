"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { ProductPhoto } from "./product-photo";
import { isUsableProductImage } from "@/lib/product-image";
import { Price } from "@/components/currency/price";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * A catalogue line item rather than a marketing tile: photograph, ruled
 * separator, then the commercial detail. The circular accent arrow button
 * that used to sit in the corner has gone — the whole card is the target.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const primaryImage =
    product.images.find((i) => i.is_primary && isUsableProductImage(i.url)) ??
    product.images.find((i) => isUsableProductImage(i.url));

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
      )
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="card-product group">
      <div
        className="relative w-full shrink-0 overflow-hidden bg-slate-100"
        style={{ aspectRatio: "4 / 3" }}
      >
        <ProductPhoto
          src={primaryImage?.url}
          alt={primaryImage?.alt ?? product.name}
          name={product.name}
          category={product.category}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.is_new && <span className="badge-orange">New</span>}
          {hasDiscount && <span className="badge-red">&minus;{discountPct}%</span>}
          {!product.in_stock && <span className="badge-slate">Backordered</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="spec text-[0.625rem] uppercase tracking-[0.16em] text-slate-500">
          {product.category.replace(/-/g, " ")}
        </div>

        <h3 className="mt-2 font-display text-[0.9375rem] font-bold leading-snug tracking-tight text-slate-900 line-clamp-2 transition-colors group-hover:text-orange-700">
          {product.name}
        </h3>

        {product.specs.height && (
          <p className="spec mt-1.5 text-xs text-slate-500">
            {product.specs.height} tall
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-slate-200 pt-4">
            <div className="text-lg font-bold tabular text-slate-900 font-display">
              <Price amount={product.price} />
            </div>
            {hasDiscount && (
              <div className="spec text-xs text-slate-400 line-through">
                <Price amount={product.compare_at_price!} original />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
