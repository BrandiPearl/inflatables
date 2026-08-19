"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { createOrderReference } from "@/lib/cart";
import { useCurrency } from "@/components/currency/currency-provider";
import { submitCartOrder } from "@/app/storefront-actions";

export function CheckoutForm() {
  const router = useRouter();
  const { items, ready, subtotal, clear } = useCart();
  const { format } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
    how_did_you_hear: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setError("");
    setLoading(true);
    const reference = createOrderReference();
    const result = await submitCartOrder({
      ...form,
      reference,
      local_total: format(subtotal),
      items: items.map((item) => ({
        sku: item.sku,
        name: item.name,
        qty: item.qty,
        price: item.price,
        slug: item.slug,
      })),
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Could not submit this order. Please try again.");
      return;
    }
    clear();
    router.push(`/checkout/success?ref=${encodeURIComponent(reference)}`);
  }

  if (!ready) return <p className="text-sm text-slate-500">Loading checkout…</p>;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
        <h2 className="text-lg font-bold text-slate-900">Nothing to check out</h2>
        <p className="mt-2 text-sm text-slate-500">Add products to your cart first.</p>
        <Link href="/products" className="btn-primary inline-flex mt-6 text-sm py-2.5 px-5">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        {error ? <p className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p> : null}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" name="first_name" value={form.first_name} onChange={handleChange} required />
          <Field label="Last name" name="last_name" value={form.last_name} onChange={handleChange} required />
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          <div className="sm:col-span-2">
            <Field label="Company (optional)" name="company" value={form.company} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Shipping address" name="address" value={form.address} onChange={handleChange} required />
          </div>
          <Field label="City" name="city" value={form.city} onChange={handleChange} required />
          <Field label="State" name="state" value={form.state} onChange={handleChange} required />
          <Field label="ZIP" name="zip" value={form.zip} onChange={handleChange} required />
        </div>
        <div>
          <label className="label" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="input"
            value={form.notes}
            onChange={handleChange}
            placeholder="Delivery constraints, blower preferences, or questions for the sales team."
          />
        </div>
        <div>
          <label className="label" htmlFor="how_did_you_hear">How did you hear about us?</label>
          <select id="how_did_you_hear" name="how_did_you_hear" className="input" value={form.how_did_you_hear} onChange={handleChange}>
            <option value="">Select one</option>
            <option>Google Search</option>
            <option>Social Media</option>
            <option>Referral</option>
            <option>Trade show</option>
            <option>Other</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </span>
          ) : (
            "Place order request"
          )}
        </button>
        <p className="text-xs text-slate-400 text-center">
          This sends the order to our sales team. We confirm freight and payment terms before you pay.
        </p>
      </form>

      <aside className="bg-white rounded-xl border border-slate-100 p-5 h-fit">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Your cart</h2>
        <ul className="space-y-3 mb-4">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              <div className="font-medium text-slate-900 leading-snug">{item.name}</div>
              <div className="text-xs text-slate-400">
                {item.qty} x {format(item.price)}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm text-slate-500">Subtotal</span>
          <span className="font-bold text-slate-900">{format(subtotal)}</span>
        </div>
        <Link href="/cart" className="block text-center text-xs font-semibold text-orange-600 mt-4 hover:underline">
          Edit cart
        </Link>
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} className="input" value={value} onChange={onChange} required={required} />
    </div>
  );
}
