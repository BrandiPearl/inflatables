"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearCmsSessionCookie,
  requireCmsSession,
  setCmsSessionCookie,
} from "@/lib/cms/auth";
import { expectedSessionToken } from "@/lib/cms/session";
import {
  BLOG_STATUSES,
  CONTACT_STATUSES,
  PRODUCT_CATEGORIES,
  QUOTE_STATUSES,
} from "@/lib/cms/constants";
import { bool, emptyToNull, lines, num, slugFrom, str, type ActionState } from "@/lib/cms/form";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductCategory } from "@/types";
import { sendMail } from "@/lib/email/mailer";
import { statusCustomerEmail } from "@/lib/email/templates";

function adminOrThrow() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Supabase service role is not configured");
  }
  return admin;
}

function fail(error: string): ActionState {
  return { error };
}

function ok(success: string): ActionState {
  return { success };
}

function revalidateStorefront(productSlug?: string, blogSlug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/quotes");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/rentals");
  revalidatePath("/blog");
  revalidatePath("/contact");
  if (productSlug) revalidatePath(`/product/${productSlug}`);
  if (blogSlug) revalidatePath(`/blog/${blogSlug}`);
}

const CATEGORY_VALUES = new Set(PRODUCT_CATEGORIES.map((item) => item.value));

function categoryFrom(form: FormData): ProductCategory {
  const value = str(form, "category");
  return CATEGORY_VALUES.has(value as ProductCategory) ? (value as ProductCategory) : "other";
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = str(formData, "password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return fail("ADMIN_PASSWORD is not set in .env.local.");
  }
  if (password !== expected) {
    return fail("That password is not correct.");
  }
  if (!(await expectedSessionToken())) {
    return fail("Could not start a CMS session.");
  }

  await setCmsSessionCookie();

  const next = str(formData, "next") || "/admin";
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await clearCmsSessionCookie();
  redirect("/admin/login");
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireCmsSession();
  const admin = adminOrThrow();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const slug = slugFrom(formData);
  const sku = str(formData, "sku") || slug.toUpperCase().replace(/-/g, "").slice(0, 24);
  const price = num(formData, "price");
  const compareAt = num(formData, "compare_at_price");

  if (!name) return fail("Name is required.");
  if (!slug) return fail("Slug is required.");
  if (price == null || price < 0) return fail("Enter a valid price.");

  const payload = {
    name,
    slug,
    sku,
    description: str(formData, "description"),
    short_description: str(formData, "short_description"),
    price,
    compare_at_price: compareAt,
    category: categoryFrom(formData),
    subcategory: emptyToNull(str(formData, "subcategory")),
    tags: lines(formData, "tags").flatMap((line) =>
      line.split(",").map((tag) => tag.trim()).filter(Boolean)
    ),
    spec_length: emptyToNull(str(formData, "spec_length")),
    spec_width: emptyToNull(str(formData, "spec_width")),
    spec_height: emptyToNull(str(formData, "spec_height")),
    spec_weight: emptyToNull(str(formData, "spec_weight")),
    spec_capacity: emptyToNull(str(formData, "spec_capacity")),
    spec_blower: emptyToNull(str(formData, "spec_blower")),
    spec_material: emptyToNull(str(formData, "spec_material")),
    spec_setup_time: emptyToNull(str(formData, "spec_setup_time")),
    spec_age_range: emptyToNull(str(formData, "spec_age_range")),
    spec_outlet: emptyToNull(str(formData, "spec_outlet")),
    is_featured: bool(formData, "is_featured"),
    is_new: bool(formData, "is_new"),
    in_stock: bool(formData, "in_stock"),
    is_active: bool(formData, "is_active"),
    rental_available: bool(formData, "rental_available"),
    purchase_available: bool(formData, "purchase_available"),
    seo_title: emptyToNull(str(formData, "seo_title")),
    seo_description: emptyToNull(str(formData, "seo_description")),
    source_site: "manual",
  };

  let productId = id;

  if (id) {
    const { error } = await admin.from("products").update(payload).eq("id", id);
    if (error) return fail(error.message);
  } else {
    const { data, error } = await admin.from("products").insert(payload).select("id").single();
    if (error || !data) return fail(error?.message ?? "Could not create product.");
    productId = String(data.id);
  }

  const imageUrls = lines(formData, "images");
  const features = lines(formData, "features");

  const { error: imageDeleteError } = await admin.from("product_images").delete().eq("product_id", productId);
  if (imageDeleteError) return fail(imageDeleteError.message);

  if (imageUrls.length) {
    const { error } = await admin.from("product_images").insert(
      imageUrls.map((url, index) => ({
        product_id: productId,
        url,
        alt: `${name} photo ${index + 1}`,
        position: index,
        is_primary: index === 0,
      }))
    );
    if (error) return fail(error.message);
  }

  const { error: featureDeleteError } = await admin.from("product_features").delete().eq("product_id", productId);
  if (featureDeleteError) return fail(featureDeleteError.message);

  if (features.length) {
    const { error } = await admin.from("product_features").insert(
      features.map((feature, index) => ({
        product_id: productId,
        feature,
        position: index,
      }))
    );
    if (error) return fail(error.message);
  }

  revalidateStorefront(slug);
  redirect(`/admin/products/${productId}/edit`);
}

export async function deleteProduct(formData: FormData) {
  await requireCmsSession();
  const admin = adminOrThrow();
  const id = str(formData, "id");
  if (!id) return;
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStorefront();
  redirect("/admin/products");
}

export async function saveBlogPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireCmsSession();
  const admin = adminOrThrow();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = slugFrom(formData, "title");
  const statusRaw = str(formData, "status");
  const status = BLOG_STATUSES.includes(statusRaw as (typeof BLOG_STATUSES)[number])
    ? statusRaw
    : "draft";

  if (!title) return fail("Title is required.");
  if (!slug) return fail("Slug is required.");

  const authorId = emptyToNull(str(formData, "author_id"));
  const payload = {
    title,
    slug,
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content"),
    cover_image: emptyToNull(str(formData, "cover_image")),
    author_id: authorId,
    category: str(formData, "category") || "General",
    tags: lines(formData, "tags").flatMap((line) =>
      line.split(",").map((tag) => tag.trim()).filter(Boolean)
    ),
    status,
    read_time: num(formData, "read_time") ?? 5,
    seo_title: emptyToNull(str(formData, "seo_title")),
    seo_desc: emptyToNull(str(formData, "seo_desc")),
    published_at:
      status === "published" ? str(formData, "published_at") || new Date().toISOString() : emptyToNull(str(formData, "published_at")),
  };

  let postId = id;
  if (id) {
    const { error } = await admin.from("blog_posts").update(payload).eq("id", id);
    if (error) return fail(error.message);
  } else {
    const { data, error } = await admin.from("blog_posts").insert(payload).select("id").single();
    if (error || !data) return fail(error?.message ?? "Could not create post.");
    postId = String(data.id);
  }

  revalidateStorefront(undefined, slug);
  redirect(`/admin/blog/${postId}/edit`);
}

export async function deleteBlogPost(formData: FormData) {
  await requireCmsSession();
  const admin = adminOrThrow();
  const id = str(formData, "id");
  if (!id) return;
  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStorefront();
  redirect("/admin/blog");
}

export async function updateQuoteStatus(formData: FormData) {
  await requireCmsSession();
  const admin = adminOrThrow();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !QUOTE_STATUSES.includes(status as (typeof QUOTE_STATUSES)[number])) return;
  const { data: existing } = await admin
    .from("quote_requests")
    .select("first_name, email, event_type")
    .eq("id", id)
    .maybeSingle();
  const { error } = await admin.from("quote_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  if (existing?.email && status !== "pending") {
    const mail = statusCustomerEmail({
      name: String(existing.first_name || "there"),
      kind: existing.event_type === "Purchase" ? "order" : "quote",
      status,
    });
    await sendMail({ to: String(existing.email), ...mail });
  }
  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
}

export async function updateContactStatus(formData: FormData) {
  await requireCmsSession();
  const admin = adminOrThrow();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !CONTACT_STATUSES.includes(status as (typeof CONTACT_STATUSES)[number])) return;
  const { data: existing } = await admin
    .from("contact_messages")
    .select("name, email")
    .eq("id", id)
    .maybeSingle();
  const { error } = await admin.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  if (existing?.email && (status === "replied" || status === "closed")) {
    const mail = statusCustomerEmail({
      name: String(existing.name || "there"),
      kind: "message",
      status,
    });
    await sendMail({ to: String(existing.email), ...mail });
  }
  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
}

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireCmsSession();
  const admin = adminOrThrow();

  const entries: [string, string][] = [
    ["business_name", str(formData, "business_name")],
    ["phone", str(formData, "phone")],
    ["email", str(formData, "email")],
    ["address", str(formData, "address")],
    ["seo_title", str(formData, "seo_title")],
    ["seo_description", str(formData, "seo_description")],
    ["announcement", str(formData, "announcement")],
    ["announcement_link_text", str(formData, "announcement_link_text")],
    ["announcement_link_url", str(formData, "announcement_link_url")],
  ];

  for (const [key, value] of entries) {
    const { error } = await admin.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    if (error) return fail(error.message);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  return ok("Settings saved.");
}

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireCmsSession();
  const admin = adminOrThrow();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const review = str(formData, "review");
  if (!name) return fail("Name is required.");
  if (!review) return fail("Review is required.");

  const payload = {
    name,
    location: emptyToNull(str(formData, "location")),
    rating: Math.min(5, Math.max(1, num(formData, "rating") ?? 5)),
    review,
    event_type: emptyToNull(str(formData, "event_type")),
    avatar_url: emptyToNull(str(formData, "avatar_url")),
    is_featured: bool(formData, "is_featured"),
    is_active: bool(formData, "is_active"),
    date: emptyToNull(str(formData, "date")),
  };

  if (id) {
    const { error } = await admin.from("testimonials").update(payload).eq("id", id);
    if (error) return fail(error.message);
  } else {
    const { error } = await admin.from("testimonials").insert(payload);
    if (error) return fail(error.message);
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  await requireCmsSession();
  const admin = adminOrThrow();
  const id = str(formData, "id");
  if (!id) return;
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}
