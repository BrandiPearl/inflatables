"use client";

import { useActionState, useMemo, useState } from "react";
import { saveProduct, deleteProduct } from "@/app/(cms)/admin/actions";
import { PRODUCT_CATEGORIES } from "@/lib/cms/constants";
import type { ActionState } from "@/lib/cms/form";
import type { AdminProduct } from "@/lib/queries/cms";
import { slugify } from "@/lib/utils";
import { FormAlert } from "@/components/cms/form-alert";

export function ProductForm({ product }: { product?: AdminProduct }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProduct, null);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const slugLocked = Boolean(product);

  const derivedSlug = useMemo(() => (slugLocked ? slug : slugify(name) || slug), [name, slug, slugLocked]);

  return (
    <form action={action} className="space-y-6 max-w-4xl">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <FormAlert state={state} />

      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Basics</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name">
            <input name="name" className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Slug">
            <input
              name="slug"
              className="input font-mono text-xs"
              value={slugLocked ? slug : derivedSlug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </Field>
          <Field label="SKU">
            <input name="sku" className="input font-mono text-xs" defaultValue={product?.sku} placeholder="Auto from slug if empty" />
          </Field>
          <Field label="Category">
            <select name="category" className="input" defaultValue={product?.category ?? "other"}>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input name="price" type="number" min="0" step="0.01" className="input" required defaultValue={product?.price ?? ""} />
          </Field>
          <Field label="Compare-at price">
            <input
              name="compare_at_price"
              type="number"
              min="0"
              step="0.01"
              className="input"
              defaultValue={product?.compare_at_price ?? ""}
            />
          </Field>
        </div>
        <Field label="Short description">
          <textarea name="short_description" className="input min-h-20" rows={3} defaultValue={product?.short_description} />
        </Field>
        <Field label="Description">
          <textarea name="description" className="input min-h-40" rows={8} defaultValue={product?.description} />
        </Field>
      </section>

      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Images and features</h2>
        <Field label="Image URLs (one per line)">
          <textarea
            name="images"
            className="input font-mono text-xs min-h-32"
            rows={6}
            defaultValue={product?.images.map((img) => img.url).join("\n")}
          />
        </Field>
        <Field label="Features (one per line)">
          <textarea name="features" className="input min-h-32" rows={6} defaultValue={product?.features.join("\n")} />
        </Field>
        <Field label="Tags (comma or line separated)">
          <input name="tags" className="input" defaultValue={product?.tags.join(", ")} />
        </Field>
      </section>

      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Specs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Length"><input name="spec_length" className="input" defaultValue={product?.spec_length} /></Field>
          <Field label="Width"><input name="spec_width" className="input" defaultValue={product?.spec_width} /></Field>
          <Field label="Height"><input name="spec_height" className="input" defaultValue={product?.spec_height} /></Field>
          <Field label="Weight"><input name="spec_weight" className="input" defaultValue={product?.spec_weight} /></Field>
          <Field label="Capacity"><input name="spec_capacity" className="input" defaultValue={product?.spec_capacity} /></Field>
          <Field label="Blower"><input name="spec_blower" className="input" defaultValue={product?.spec_blower} /></Field>
          <Field label="Material"><input name="spec_material" className="input" defaultValue={product?.spec_material} /></Field>
          <Field label="Setup time"><input name="spec_setup_time" className="input" defaultValue={product?.spec_setup_time} /></Field>
          <Field label="Age range"><input name="spec_age_range" className="input" defaultValue={product?.spec_age_range} /></Field>
          <Field label="Outlet"><input name="spec_outlet" className="input" defaultValue={product?.spec_outlet} /></Field>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Flags and SEO</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Check name="is_active" label="Active on site" defaultChecked={product?.is_active ?? true} />
          <Check name="in_stock" label="In stock" defaultChecked={product?.in_stock ?? true} />
          <Check name="is_featured" label="Featured" defaultChecked={product?.is_featured} />
          <Check name="is_new" label="New" defaultChecked={product?.is_new} />
          <Check name="rental_available" label="Rental available" defaultChecked={product?.rental_available ?? true} />
          <Check name="purchase_available" label="Purchase available" defaultChecked={product?.purchase_available ?? true} />
        </div>
        <Field label="SEO title">
          <input name="seo_title" className="input" defaultValue={product?.seo_title} />
        </Field>
        <Field label="SEO description">
          <textarea name="seo_description" className="input" rows={3} defaultValue={product?.seo_description} />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary text-sm py-2 px-4" disabled={pending}>
          {pending ? "Saving…" : product ? "Save product" : "Create product"}
        </button>
        {product ? (
          <button
            formAction={deleteProduct}
            className="btn-secondary text-sm py-2 px-4 text-red-600"
            onClick={(event) => {
              if (!confirm("Delete this product? This cannot be undone.")) event.preventDefault();
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="rounded border-slate-300" />
      {label}
    </label>
  );
}
