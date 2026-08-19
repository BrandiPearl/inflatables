"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Minus, Plus, Mail } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useSettings } from "@/components/layout/settings-provider";
import { mailHref } from "@/lib/utils";

type ProductInput = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  in_stock: boolean;
};

export function ProductBuyBox({ product }: { product: ProductInput }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { email } = useSettings();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function add(qtyToAdd: number) {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.image,
      },
      qtyToAdd
    );
    setAdded(true);
  }

  return (
    <div className="mt-7 flex flex-col gap-3">
      {product.in_stock ? (
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border border-slate-200 rounded-lg">
            <button
              type="button"
              className="p-3 text-slate-600 hover:text-slate-900"
              aria-label="Decrease quantity"
              onClick={() => setQty((n) => Math.max(1, n - 1))}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              className="p-3 text-slate-600 hover:text-slate-900"
              aria-label="Increase quantity"
              onClick={() => setQty((n) => n + 1)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            className="btn-primary flex-1 text-base py-3.5"
            onClick={() => add(qty)}
          >
            {added ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Added to cart
              </span>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      ) : (
        <button type="button" className="btn-primary w-full text-base py-3.5" disabled>
          Out of stock
        </button>
      )}

      {added ? (
        <div className="flex gap-3">
          <Link href="/cart" className="btn-secondary flex-1 text-center py-3">
            View cart
          </Link>
          <button
            type="button"
            className="btn-primary flex-1 py-3"
            onClick={() => router.push("/checkout")}
          >
            Checkout
          </button>
        </div>
      ) : product.in_stock ? (
        <button
          type="button"
          className="btn-secondary w-full text-base py-3.5"
          onClick={() => {
            add(qty);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      ) : null}

      <Link href="/quote" className="btn-secondary w-full text-base py-3.5 text-center">
        Request a Quote
      </Link>
      <a
        href={mailHref(email)}
        className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-orange-600 transition-colors py-1"
      >
        <Mail className="w-4 h-4" />
        Questions? Email {email}
      </a>
    </div>
  );
}
