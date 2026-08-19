/**
 * Product query functions.
 * Falls back to mock data if Supabase credentials are not configured,
 * so the site works fully before credentials are added.
 */

import type { Product, FilterState, Category } from "@/types";
import { CATEGORIES, FEATURED_PRODUCTS } from "@/lib/data/mock-products";
import { selectProductImages } from "@/lib/product-image";
import {
  cleanProductDescription,
  isUsefulFeature,
  specsFromCopy,
} from "@/lib/product-copy";

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PRODUCT_SELECT = `*, product_images(*), product_features(*)`;

// ─── Shape mapper: Supabase row → Product ───────────────────────────────────

function mapRow(row: Record<string, unknown>): Product {
  const sku = String(row.sku ?? "");
  const images = selectProductImages(
    ((row.product_images as Record<string, unknown>[]) ?? []).map((img) => ({
      id: String(img.id ?? ""),
      url: String(img.url ?? ""),
      alt: String(img.alt ?? ""),
      position: Number(img.position ?? 0),
      is_primary: Boolean(img.is_primary),
    })),
    sku
  );

  const features = ((row.product_features as Record<string, unknown>[]) ?? [])
    .sort((a, b) => Number(a.position) - Number(b.position))
    .map((f) => String(f.feature ?? "").replace(/\s+/g, " ").trim())
    .filter(isUsefulFeature);

  const name = String(row.name ?? "");
  const description = cleanProductDescription(String(row.description ?? ""), name);
  const shortRaw = cleanProductDescription(String(row.short_description ?? ""), name);
  const short_description = (shortRaw || description).slice(0, 220);

  const specs = specsFromCopy(
    {
      length: row.spec_length ? String(row.spec_length) : undefined,
      width: row.spec_width ? String(row.spec_width) : undefined,
      height: row.spec_height ? String(row.spec_height) : undefined,
      weight: row.spec_weight ? String(row.spec_weight) : undefined,
      capacity: row.spec_capacity ? String(row.spec_capacity) : undefined,
      blower: row.spec_blower ? String(row.spec_blower) : undefined,
      material: row.spec_material ? String(row.spec_material) : undefined,
      setup_time: row.spec_setup_time ? String(row.spec_setup_time) : undefined,
      age_range: row.spec_age_range ? String(row.spec_age_range) : undefined,
      outlet_required: row.spec_outlet ? String(row.spec_outlet) : undefined,
    },
    name,
    features,
    description
  );

  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    sku,
    name,
    description,
    short_description,
    price: Number(row.price ?? 0),
    compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    category: (row.category as Product["category"]) ?? "other",
    subcategory: row.subcategory ? String(row.subcategory) : undefined,
    tags: (row.tags as string[]) ?? [],
    images,
    specs,
    features,
    is_featured: Boolean(row.is_featured),
    is_new: Boolean(row.is_new),
    in_stock: Boolean(row.in_stock),
    rental_available: Boolean(row.rental_available),
    purchase_available: Boolean(row.purchase_available),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

// ─── Get featured products ───────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!SUPABASE_CONFIGURED) {
    return FEATURED_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts:", error.message);
    return FEATURED_PRODUCTS.slice(0, limit);
  }

  let mapped = (data ?? []).map(mapRow).filter((p) => p.images.length > 0);

  if (mapped.length === 0) {
    const fallback = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(Math.max(limit * 4, 24));

    mapped = (fallback.data ?? [])
      .map((row) => mapRow(row as Record<string, unknown>))
      .filter((p) => p.images.length > 0);
  }

  return mapped.slice(0, limit);
}

// ─── Get all products (with filtering) ──────────────────────────────────────

export async function getProducts(filters: FilterState = {}): Promise<Product[]> {
  if (!SUPABASE_CONFIGURED) {
    let products = [...FEATURED_PRODUCTS];
    if (filters.category) products = products.filter((p) => p.category === filters.category);
    if (filters.inStock) products = products.filter((p) => p.in_stock);
    if (filters.priceMin) products = products.filter((p) => p.price >= filters.priceMin!);
    if (filters.priceMax) products = products.filter((p) => p.price <= filters.priceMax!);
    return products;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .limit(2000);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.inStock) query = query.eq("in_stock", true);
  if (filters.priceMin) query = query.gte("price", filters.priceMin);
  if (filters.priceMax) query = query.lte("price", filters.priceMax);

  switch (filters.sort) {
    case "price-asc": query = query.order("price", { ascending: true }); break;
    case "price-desc": query = query.order("price", { ascending: false }); break;
    case "newest": query = query.order("created_at", { ascending: false }); break;
    case "az": query = query.order("name", { ascending: true }); break;
    case "za": query = query.order("name", { ascending: false }); break;
    default: query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("getProducts:", error.message);
    return FEATURED_PRODUCTS;
  }

  return (data ?? []).map(mapRow);
}

// ─── Get single product by slug ──────────────────────────────────────────────

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!SUPABASE_CONFIGURED) {
    return FEATURED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

// ─── Get related products ────────────────────────────────────────────────────

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 3
): Promise<Product[]> {
  if (!SUPABASE_CONFIGURED) {
    return FEATURED_PRODUCTS.filter(
      (p) => p.id !== productId && p.category === category
    ).slice(0, limit);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("category", category)
    .neq("id", productId)
    .limit(limit);

  if (error) return [];
  return (data ?? []).map(mapRow);
}

export async function getCategories(): Promise<Category[]> {
  if (!SUPABASE_CONFIGURED) return CATEGORIES;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("category, sku, product_images(url, is_primary, position)")
    .eq("is_active", true)
    .limit(2000);

  if (error || !data) {
    console.error("getCategories:", error?.message);
    return CATEGORIES;
  }

  const counts: Record<string, number> = {};
  const covers: Record<string, string> = {};

  for (const row of data) {
    const cat = String(row.category);
    counts[cat] = (counts[cat] ?? 0) + 1;
    if (covers[cat]) continue;
    const images = selectProductImages(
      ((row.product_images as Record<string, unknown>[]) ?? []).map((img) => ({
        id: "",
        url: String(img.url ?? ""),
        alt: "",
        position: Number(img.position ?? 0),
        is_primary: Boolean(img.is_primary),
      })),
      String(row.sku ?? "")
    );
    if (images[0]?.url) covers[cat] = images[0].url;
  }

  return CATEGORIES.map((cat) => ({
    ...cat,
    product_count: counts[cat.slug] ?? 0,
    image_url: covers[cat.slug] || cat.image_url,
  }));
}

export async function getProductSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (!SUPABASE_CONFIGURED) {
    return FEATURED_PRODUCTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true)
    .limit(2000);

  if (error || !data) return FEATURED_PRODUCTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  return data.map((row) => ({
    slug: String(row.slug),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  }));
}
