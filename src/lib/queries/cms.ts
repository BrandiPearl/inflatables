import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductCategory } from "@/types";

export type QuoteListItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  city: string;
  state: string;
  zip: string;
  guests_count: string;
  products_interested: string[];
  budget: string;
  message: string;
  status: string;
  created_at: string;
};

export type ContactListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  short_description: string;
  price: number;
  category: ProductCategory;
  in_stock: boolean;
  is_active: boolean;
  is_featured: boolean;
};

export type AdminProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  category: ProductCategory;
  subcategory: string;
  tags: string[];
  spec_length: string;
  spec_width: string;
  spec_height: string;
  spec_weight: string;
  spec_capacity: string;
  spec_blower: string;
  spec_material: string;
  spec_setup_time: string;
  spec_age_range: string;
  spec_outlet: string;
  is_featured: boolean;
  is_new: boolean;
  in_stock: boolean;
  is_active: boolean;
  rental_available: boolean;
  purchase_available: boolean;
  seo_title: string;
  seo_description: string;
  images: { url: string; alt: string }[];
  features: string[];
};

export type AdminTestimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  event_type: string;
  avatar_url: string;
  is_featured: boolean;
  is_active: boolean;
  date: string;
};

export type AdminAuthor = {
  id: string;
  name: string;
};

function text(value: unknown) {
  return value == null ? "" : String(value);
}

export async function getQuoteRequests(limit = 50): Promise<QuoteListItem[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("quote_requests")
    .select(
      "id, first_name, last_name, email, phone, event_type, event_date, city, state, zip, guests_count, products_interested, budget, message, status, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getQuoteRequests:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    first_name: text(row.first_name),
    last_name: text(row.last_name),
    email: text(row.email),
    phone: text(row.phone),
    event_type: text(row.event_type),
    event_date: text(row.event_date),
    city: text(row.city),
    state: text(row.state),
    zip: text(row.zip),
    guests_count: text(row.guests_count),
    products_interested: Array.isArray(row.products_interested)
      ? row.products_interested.map((item) => String(item))
      : [],
    budget: text(row.budget),
    message: text(row.message),
    status: text(row.status) || "pending",
    created_at: text(row.created_at),
  }));
}

export async function getContactMessages(limit = 50): Promise<ContactListItem[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("contact_messages")
    .select("id, name, email, phone, subject, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getContactMessages:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: text(row.name),
    email: text(row.email),
    phone: text(row.phone),
    subject: text(row.subject),
    message: text(row.message),
    status: text(row.status) || "new",
    created_at: text(row.created_at),
  }));
}

export async function getAdminStats() {
  const admin = createAdminClient();
  const empty = { products: 0, quotes: 0, posts: 0, testimonials: 0, contacts: 0 };
  if (!admin) return empty;

  const [products, quotes, posts, testimonials, contacts] = await Promise.all([
    admin.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("quote_requests").select("id", { count: "exact", head: true }),
    admin.from("blog_posts").select("id", { count: "exact", head: true }),
    admin.from("testimonials").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  return {
    products: products.count ?? 0,
    quotes: quotes.count ?? 0,
    posts: posts.count ?? 0,
    testimonials: testimonials.count ?? 0,
    contacts: contacts.count ?? 0,
  };
}

export async function getAdminProducts(): Promise<AdminProductListItem[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("products")
    .select("id, slug, sku, name, short_description, price, category, in_stock, is_active, is_featured")
    .order("name", { ascending: true })
    .limit(2000);

  if (error) {
    console.error("getAdminProducts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    slug: text(row.slug),
    sku: text(row.sku),
    name: text(row.name),
    short_description: text(row.short_description),
    price: Number(row.price ?? 0),
    category: (row.category as ProductCategory) ?? "other",
    in_stock: Boolean(row.in_stock),
    is_active: Boolean(row.is_active),
    is_featured: Boolean(row.is_featured),
  }));
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("products")
    .select("*, product_images(*), product_features(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getAdminProduct:", error.message);
    return null;
  }

  const row = data as Record<string, unknown>;
  const images = ((row.product_images as Record<string, unknown>[]) ?? [])
    .sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0))
    .map((img) => ({
      url: text(img.url),
      alt: text(img.alt),
    }));

  const features = ((row.product_features as Record<string, unknown>[]) ?? [])
    .sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0))
    .map((item) => text(item.feature))
    .filter(Boolean);

  return {
    id: String(row.id ?? ""),
    slug: text(row.slug),
    sku: text(row.sku),
    name: text(row.name),
    description: text(row.description),
    short_description: text(row.short_description),
    price: Number(row.price ?? 0),
    compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
    category: (row.category as ProductCategory) ?? "other",
    subcategory: text(row.subcategory),
    tags: (row.tags as string[]) ?? [],
    spec_length: text(row.spec_length),
    spec_width: text(row.spec_width),
    spec_height: text(row.spec_height),
    spec_weight: text(row.spec_weight),
    spec_capacity: text(row.spec_capacity),
    spec_blower: text(row.spec_blower),
    spec_material: text(row.spec_material),
    spec_setup_time: text(row.spec_setup_time),
    spec_age_range: text(row.spec_age_range),
    spec_outlet: text(row.spec_outlet),
    is_featured: Boolean(row.is_featured),
    is_new: Boolean(row.is_new),
    in_stock: Boolean(row.in_stock),
    is_active: row.is_active !== false,
    rental_available: row.rental_available !== false,
    purchase_available: row.purchase_available !== false,
    seo_title: text(row.seo_title),
    seo_description: text(row.seo_description),
    images,
    features,
  };
}

export async function getAuthors(): Promise<AdminAuthor[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin.from("authors").select("id, name").order("name");
  if (error) {
    console.error("getAuthors:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: text(row.name),
  }));
}

export async function getAdminTestimonials(): Promise<AdminTestimonial[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminTestimonials:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: text(row.name),
    location: text(row.location),
    rating: Number(row.rating ?? 5),
    review: text(row.review),
    event_type: text(row.event_type),
    avatar_url: text(row.avatar_url),
    is_featured: Boolean(row.is_featured),
    is_active: row.is_active !== false,
    date: text(row.date),
  }));
}

export async function getAdminTestimonial(id: string): Promise<AdminTestimonial | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (error || !data) {
    if (error) console.error("getAdminTestimonial:", error.message);
    return null;
  }

  return {
    id: String(data.id),
    name: text(data.name),
    location: text(data.location),
    rating: Number(data.rating ?? 5),
    review: text(data.review),
    event_type: text(data.event_type),
    avatar_url: text(data.avatar_url),
    is_featured: Boolean(data.is_featured),
    is_active: data.is_active !== false,
    date: text(data.date),
  };
}
