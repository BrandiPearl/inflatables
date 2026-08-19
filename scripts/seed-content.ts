/**
 * Seed authors, blog posts, testimonials, categories, and site settings.
 * Safe to re-run: upserts by slug/key, skips existing testimonials with the same name.
 *
 *   npx tsx scripts/seed-content.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { CATEGORIES, BLOG_POSTS, TESTIMONIALS } from "../src/lib/data/mock-products";
import { BLOG_ARTICLE_BODIES } from "../src/lib/data/blog-articles";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function isLogoUrl(url: string) {
  const u = url.toLowerCase();
  return u.includes("logo") || u.endsWith(".svg");
}

async function pickCoverImages(): Promise<string[]> {
  const { data } = await supabase
    .from("product_images")
    .select("url")
    .limit(80);

  const urls = [...new Set(
    (data ?? [])
      .map((row) => String(row.url ?? ""))
      .filter((u) => u.startsWith("http") && !isLogoUrl(u) && !u.toLowerCase().endsWith(".svg"))
  )];

  return urls.length > 0 ? urls : ["/images/hero-inflatables.jpg"];
}

async function seedAuthors() {
  const authors = [
    {
      name: "James Holloway",
      slug: "james-holloway",
      bio: "20-year veteran of the commercial inflatable industry.",
    },
    {
      name: "Lisa Crawford",
      slug: "lisa-crawford",
      bio: "Certified event safety consultant.",
    },
  ];

  for (const author of authors) {
    const { error } = await supabase.from("authors").upsert(author, { onConflict: "slug" });
    if (error) throw error;
  }

  const { data, error } = await supabase.from("authors").select("id, slug");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((a) => [a.slug, a.id])) as Record<string, string>;
}

async function seedBlog(authorIds: Record<string, string>, covers: string[]) {
  const authorByMock = {
    a1: authorIds["james-holloway"],
    a2: authorIds["lisa-crawford"],
  };

  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const post = BLOG_POSTS[i];
    const row = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: BLOG_ARTICLE_BODIES[post.slug] ?? post.excerpt,
      cover_image: covers[i % covers.length],
      author_id: authorByMock[post.author.id as keyof typeof authorByMock] ?? authorIds["james-holloway"],
      category: post.category,
      tags: post.tags,
      status: "published",
      read_time: post.read_time,
      seo_title: post.title,
      seo_desc: post.excerpt,
      seo_keywords: post.tags,
      published_at: post.published_at,
    };
    const { error } = await supabase.from("blog_posts").upsert(row, { onConflict: "slug" });
    if (error) throw error;
    console.log(`  ✓ blog: ${post.title}`);
  }
}

async function seedTestimonials() {
  const { data: existing } = await supabase.from("testimonials").select("name");
  const names = new Set((existing ?? []).map((t) => String(t.name)));

  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i];
    if (names.has(t.name)) {
      console.log(`  · testimonial exists: ${t.name}`);
      continue;
    }
    const { error } = await supabase.from("testimonials").insert({
      name: t.name,
      location: t.location,
      rating: t.rating,
      review: t.review,
      event_type: t.event_type,
      is_featured: i === 0,
      is_active: true,
      date: t.date,
    });
    if (error) throw error;
    console.log(`  ✓ testimonial: ${t.name}`);
  }
}

async function seedCategories() {
  for (const cat of CATEGORIES) {
    const { error } = await supabase.from("categories").upsert(
      {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image_url: cat.image_url,
        position: cat.position,
        is_active: true,
      },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }
  console.log(`  ✓ ${CATEGORIES.length} categories`);
}

async function seedSettings() {
  const settings: [string, unknown][] = [
    ["business_name", "Wonderland Inflatables"],
    ["phone", "0468 292 610"],
    ["email", "wonderlandinflatables10@gmail.com"],
    ["address", "3200 Commerce Blvd, Ontario, CA 91761"],
    ["seo_title", "Wonderland Inflatables | Commercial Bounce Houses & Water Slides"],
    [
      "seo_description",
      "Commercial-grade bounce houses, water slides, obstacle courses, and combos for rental businesses and large events. Ships to all 48 states. ASTM certified.",
    ],
    ["announcement", "Free shipping on orders over $2,500"],
    ["announcement_link_text", "Get a free quote today"],
    ["announcement_link_url", "/quote"],
  ];

  for (const [key, value] of settings) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
  }
  console.log(`  ✓ ${settings.length} site settings`);
}

async function main() {
  console.log("Seeding live site content…\n");
  const covers = await pickCoverImages();
  const authorIds = await seedAuthors();
  await seedBlog(authorIds, covers);
  await seedTestimonials();
  await seedCategories();
  await seedSettings();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
