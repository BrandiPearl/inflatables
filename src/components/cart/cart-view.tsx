"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useCurrency } from "@/components/currency/currency-provider";

export function CartView() {
  const { items, ready, setQty, removeItem, subtotal } = useCart();
  const { format } = useCurrency();

  if (!ready) {
    return <p className="text-sm text-slate-500">Loading cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
        <h2 className="text-lg font-bold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-500">Add commercial inflatables from the catalog to build an order.</p>
        <Link href="/products" className="btn-primary inline-flex mt-6 text-sm py-2.5 px-5">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-4">
            <Link href={`/product/${item.slug}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.slug}`} className="font-semibold text-slate-900 hover:text-orange-600">
                {item.name}
              </Link>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">{item.sku}</div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center border border-slate-200 rounded-lg">
                  <button
                    type="button"
                    className="p-2 text-slate-600"
                    aria-label="Decrease quantity"
                    onClick={() => setQty(item.id, item.qty - 1)}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                  <button
                    type="button"
                    className="p-2 text-slate-600"
                    aria-label="Increase quantity"
                    onClick={() => setQty(item.id, item.qty + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="font-bold text-slate-900">{format(item.price * item.qty)}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="self-start p-2 text-slate-400 hover:text-red-600"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <aside className="bg-white rounded-xl border border-slate-100 p-5 h-fit">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Order summary</h2>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold text-slate-900">{format(subtotal)}</span>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Freight is quoted after we confirm destination and unit mix. Prices are shown in your currency. Quotes are confirmed in USD.
        </p>
        <Link href="/checkout" className="btn-primary w-full justify-center text-sm py-3">
          Continue to checkout
        </Link>
        <Link href="/products" className="block text-center text-xs font-semibold text-slate-500 hover:text-orange-600 mt-3">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
