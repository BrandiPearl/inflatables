/**
 * Product Scraper - Wonderland Inflatables
 * =========================================
 * Pulls product data from ultimatejumpers.com and jumporange.com
 * and seeds the Supabase `products`, `product_images`, and
 * `product_features` tables.
 *
 * Usage:
 *   npx tsx scripts/scrape-products.ts
 *   npx tsx scripts/scrape-products.ts --dry-run
 *   npx tsx scripts/scrape-products.ts --from-cache   # seed last scrape, skip already in DB
 *   npx tsx scripts/scrape-products.ts --source=jumporange
 *
 * Requires (seed only):
 *   .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const HTTP_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; WonderlandScraper/1.0; +https://wonderlandinflatables.com)",
  Accept: "text/html,application/xhtml+xml,application/json",
};

interface ScrapedProduct {
  name: string;
  price: number;
  compare_at_price?: number;
  description: string;
  category: string;
  images: { url: string; alt: string }[];
  features: string[];
  specs: Record<string, string>;
  tags: string[];
  source_url: string;
  source_site: "ultimatejumpers" | "jumporange";
  source_id: string;
}

const UJ_CATEGORY_MAP: Record<number, string> = {
  45: "bounce-houses", // Inflatable Jumpers
  44: "water-slides", // Inflatable Water Slides
  4: "water-slides", // Inflatable Slides
  46: "combos", // Inflatable Combos
  49: "obstacle-courses", // Inflatable Obstacle Courses
  47: "interactive", // Inflatable Interactives
  54: "tents-tables", // Inflatable Tents
  48: "other", // Indoor units
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parsePrice(str: string): number {
  const cleaned = str.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function inferCategory(name: string, tags: string[]): string {
  const combined = `${name} ${tags.join(" ")}`.toLowerCase();
  if (combined.includes("water slide") || combined.includes("slip n slide") || combined.includes("slip-n-slide")) {
    return "water-slides";
  }
  if (combined.includes("combo") || combined.includes("3 in 1") || (combined.includes("wet") && combined.includes("dry"))) {
    return "combos";
  }
  if (combined.includes("obstacle")) return "obstacle-courses";
  if (
    combined.includes("interactive") ||
    combined.includes("game") ||
    combined.includes("ring") ||
    combined.includes("sport") ||
    combined.includes("challenge")
  ) {
    return "interactive";
  }
  if (combined.includes("tent") || combined.includes("table") || combined.includes("chair")) {
    return "tents-tables";
  }
  if (combined.includes("bounce") || combined.includes("castle") || combined.includes("jumper")) {
    return "bounce-houses";
  }
  if (combined.includes("slide")) return "water-slides";
  return "other";
}

const CACHE_PATH = path.resolve(process.cwd(), "scripts/.scrape-cache.json");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const code = (err as AxiosError)?.code ?? "";
  return (
    msg.includes("fetch failed") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("timeout") ||
    msg.includes("socket hang up") ||
    msg.includes("NetworkError") ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNABORTED" ||
    code === "ENOTFOUND"
  );
}

async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
  attempts = 5
): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryableError(err) || i === attempts) break;
      const wait = Math.min(30_000, 1000 * 2 ** (i - 1));
      console.warn(`  ↻ ${label} failed (${(err as Error).message}). Retry ${i}/${attempts} in ${wait / 1000}s`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

function loadCache(): ScrapedProduct[] {
  if (!fs.existsSync(CACHE_PATH)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    return Array.isArray(raw) ? (raw as ScrapedProduct[]) : [];
  } catch {
    return [];
  }
}

function saveCache(products: ScrapedProduct[]) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(products, null, 2));
}

function mergeCache(existing: ScrapedProduct[], incoming: ScrapedProduct[]): ScrapedProduct[] {
  const map = new Map(existing.map((p) => [`${p.source_site}:${p.source_id}`, p]));
  for (const p of incoming) map.set(`${p.source_site}:${p.source_id}`, p);
  return [...map.values()];
}

function isScrapedImageUrl(src: string): boolean {
  const u = src.toLowerCase();
  if (!u.includes("/wp-content/uploads/") && !u.startsWith("http")) return false;
  if (u.includes("logo") || u.includes("favicon") || u.endsWith(".svg")) return false;
  if (u.includes("410x410") || u.includes("410x356") || /-150x150/.test(u)) return false;
  return true;
}

async function loadExistingSourceUrls(): Promise<Set<string>> {
  const urls = new Set<string>();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return urls;
  }

  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await withRetry("load existing product URLs", async () => {
      const res = await supabase
        .from("products")
        .select("source_url")
        .range(from, from + pageSize - 1);
      if (res.error) throw res.error;
      return res;
    });
    if (!data?.length) break;
    for (const row of data) {
      if (row.source_url) urls.add(row.source_url);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return urls;
}

async function fetchHtml(url: string): Promise<string> {
  return withRetry(`GET ${url}`, async () => {
    const { data } = await axios.get(url, {
      headers: HTTP_HEADERS,
      timeout: 25000,
    });
    return data;
  });
}

function specsFromListItems(items: string[]): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const item of items) {
    const match = item.match(/^([A-Z][A-Z0-9 /_-]{1,24}):\s*(.+)$/i);
    if (!match) continue;
    const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
    specs[key] = match[2].trim();
  }
  return specs;
}

// ─── Ultimate Jumpers ─────────────────────────────────────────────────────────

async function scrapeUltimateJumpers(skipUrls: Set<string> = new Set()): Promise<ScrapedProduct[]> {
  console.log("\n📦 Scraping ultimatejumpers.com…");
  const products: ScrapedProduct[] = [];
  const links: { url: string; catIds: number[] }[] = [];

  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `https://ultimatejumpers.com/wp-json/wp/v2/product?per_page=100&page=${page}`;
    try {
      const res = await withRetry(`UJ REST page ${page}`, () =>
        axios.get(url, { headers: HTTP_HEADERS, timeout: 25000 })
      );
      const total = Number(res.headers["x-wp-totalpages"] ?? 1);
      totalPages = Number.isFinite(total) && total > 0 ? total : 1;

      const items = (res.data as Record<string, unknown>[]) ?? [];
      console.log(`  REST page ${page}/${totalPages}: ${items.length} products`);

      for (const item of items) {
        const link = String(item.link ?? "");
        if (!link) continue;
        const catIds = Array.isArray(item["product-cat"])
          ? (item["product-cat"] as number[])
          : [];
        links.push({ url: link, catIds });
      }
    } catch (err) {
      console.warn(`  ⚠ Failed REST page ${page}:`, (err as Error).message);
      break;
    }
    page++;
    await sleep(200);
  }

  console.log(`  Found ${links.length} product URLs. Scraping detail pages…`);

  const cached = loadCache().filter((p) => p.source_site === "ultimatejumpers");
  const cachedByUrl = new Map(cached.map((p) => [p.source_url, p]));
  let skippedExisting = 0;
  let usedCache = 0;

  for (let i = 0; i < links.length; i++) {
    const { url, catIds } = links[i];
    if (skipUrls.has(url)) {
      skippedExisting++;
      continue;
    }
    const cachedProduct = cachedByUrl.get(url);
    if (cachedProduct) {
      products.push(cachedProduct);
      usedCache++;
      continue;
    }
    try {
      const product = await scrapeUltimateJumperProduct(url, catIds);
      if (product) {
        products.push(product);
        saveCache(mergeCache(loadCache(), [product]));
      }
      if ((i + 1) % 25 === 0) {
        console.log(`  … ${i + 1}/${links.length} (${products.length} parsed, ${skippedExisting} already in DB)`);
      }
      await sleep(250);
    } catch (err) {
      console.warn(`  ⚠ Failed ${url}:`, (err as Error).message);
    }
  }

  if (skippedExisting || usedCache) {
    console.log(`  Skipped ${skippedExisting} already in DB, reused ${usedCache} from cache`);
  }

  return products;
}

async function scrapeUltimateJumperProduct(
  url: string,
  catIds: number[] = []
): Promise<ScrapedProduct | null> {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const cartBtn = $(".js-single-product-add-to-cart").first();
  const name =
    $("h1.name").first().text().trim() ||
    $("h1.product_title").first().text().trim() ||
    String(cartBtn.attr("data-product-title") ?? "").trim();
  if (!name) return null;

  const price =
    parsePrice($(".js-single-product-price").first().text()) ||
    parsePrice(String(cartBtn.attr("data-product-price") ?? ""));
  if (!price) return null;

  const compareRaw =
    String(cartBtn.attr("data-product-old-price") ?? "") ||
    $("del .woocommerce-Price-amount, .old-price").first().text();
  const compare_at_price = parsePrice(compareRaw) || undefined;

  const description = (
    $("#information").text().trim() ||
    $(".product-contain").text().replace(/View More/g, "").trim() ||
    $(".woocommerce-product-details__short-description").text().trim()
  ).replace(/\s+/g, " ");

  const images: { url: string; alt: string }[] = [];
  const primary = cartBtn.attr("data-product-image");
  if (primary && isScrapedImageUrl(primary)) {
    images.push({ url: primary.split("?")[0], alt: name });
  }

  $("img").each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src") || "";
    if (!src.includes("/wp-content/uploads/")) return;
    if (!isScrapedImageUrl(src)) return;
    const clean = src.split("?")[0];
    if (!images.find((i) => i.url === clean)) {
      images.push({ url: clean, alt: $(el).attr("alt") || name });
    }
  });

  const features: string[] = [];
  $("#information li, .product-contain li").each((_, el) => {
    const text = $(el).text().trim();
    if (text) features.push(text);
  });

  const specs: Record<string, string> = {
    ...specsFromListItems(features),
  };
  $(".woocommerce-product-attributes tr").each((_, el) => {
    const key = $(el).find("th").text().trim().toLowerCase().replace(/\s+/g, "_");
    const val = $(el).find("td").text().trim();
    if (key && val) specs[key] = val;
  });

  const sku =
    $(".sku").text().trim() ||
    (name.match(/\b([A-Z]\d{2,})\b/)?.[1] ?? "") ||
    String(cartBtn.attr("data-product-id") ?? "");

  const mappedCat = catIds.map((id) => UJ_CATEGORY_MAP[id]).find(Boolean);
  const category = mappedCat ?? inferCategory(name, features);

  return {
    name,
    price,
    compare_at_price: compare_at_price && compare_at_price > price ? compare_at_price : undefined,
    description,
    category,
    images: images.slice(0, 10),
    features: features.slice(0, 12),
    specs,
    tags: [],
    source_url: url,
    source_site: "ultimatejumpers",
    source_id: sku || slugify(name),
  };
}

// ─── Jump Orange ──────────────────────────────────────────────────────────────

async function scrapeJumpOrange(): Promise<ScrapedProduct[]> {
  console.log("\n🍊 Scraping jumporange.com…");
  const products: ScrapedProduct[] = [];
  let page = 1;

  while (true) {
    const url = `https://www.jumporange.com/products.json?limit=250&page=${page}`;
    try {
      const { data } = await withRetry(`JO catalog page ${page}`, () =>
        axios.get(url, { headers: HTTP_HEADERS, timeout: 25000 })
      );
      const shopifyProducts = data.products ?? [];
      if (shopifyProducts.length === 0) break;

      console.log(`  Catalog page ${page}: ${shopifyProducts.length} products`);

      for (const sp of shopifyProducts) {
        try {
          products.push(transformShopifyProduct(sp));
        } catch (err) {
          console.warn(`  ⚠ Failed to transform ${sp.handle}:`, (err as Error).message);
        }
      }

      saveCache(mergeCache(loadCache(), products));

      if (shopifyProducts.length < 250) break;
      page++;
      await sleep(300);
    } catch (err) {
      console.warn(`  ⚠ Failed catalog page ${page}:`, (err as Error).message);
      break;
    }
  }

  return products;
}

function transformShopifyProduct(sp: Record<string, unknown>): ScrapedProduct {
  const variants = (sp.variants as Record<string, unknown>[]) ?? [];
  const firstVariant = (variants[0] as Record<string, unknown>) ?? {};
  const price = parseFloat(String(firstVariant.price ?? 0));
  const compareAt = firstVariant.compare_at_price
    ? parseFloat(String(firstVariant.compare_at_price))
    : undefined;

  const images = ((sp.images as Record<string, unknown>[]) ?? []).map((img) => ({
    url: String(img.src ?? ""),
    alt: String(img.alt ?? sp.title ?? ""),
  }));

  const bodyHtml = String(sp.body_html ?? "");
  const $ = cheerio.load(bodyHtml);
  const features: string[] = [];
  $("li").each((_, el) => {
    const text = $(el).text().trim();
    if (text) features.push(text);
  });

  const tags = normalizeTags(sp.tags);
  const specs: Record<string, string> = {
    ...specsFromListItems(features),
  };
  $("table tr").each((_, el) => {
    const cells = $(el).find("td, th");
    if (cells.length >= 2) {
      const key = cells.eq(0).text().trim().toLowerCase().replace(/\s+/g, "_");
      const val = cells.eq(1).text().trim();
      if (key && val) specs[key] = val;
    }
  });

  const sku = String(firstVariant.sku ?? specs.sku ?? sp.id ?? "");

  return {
    name: String(sp.title ?? ""),
    price,
    compare_at_price: compareAt && compareAt > price ? compareAt : undefined,
    description: bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    category: inferCategory(String(sp.title ?? ""), tags),
    images,
    features: features.slice(0, 12),
    specs,
    tags,
    source_url: `https://www.jumporange.com/products/${sp.handle}`,
    source_site: "jumporange",
    source_id: sku || String(sp.id ?? ""),
  };
}

// ─── Supabase Seeder ─────────────────────────────────────────────────────────

async function seedProduct(product: ScrapedProduct): Promise<"inserted" | "skipped"> {
  return withRetry(`seed ${product.name}`, async () => {
    const slug = slugify(product.name);
    const sku = `${product.source_site.toUpperCase().slice(0, 2)}-${product.source_id}`.slice(0, 50);

    const { data: existing, error: lookupError } = await supabase
      .from("products")
      .select("id")
      .eq("source_id", product.source_id)
      .eq("source_site", product.source_site)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (existing) {
      await backfillMedia(existing.id, product);
      return "skipped";
    }

    const productRow = {
      slug,
      sku,
      name: product.name,
      description: product.description,
      short_description: product.description.slice(0, 200),
      price: product.price,
      compare_at_price: product.compare_at_price ?? null,
      category: product.category,
      tags: product.tags,
      in_stock: true,
      is_active: true,
      rental_available: true,
      purchase_available: true,
      source_url: product.source_url,
      source_site: product.source_site,
      source_id: product.source_id,
      spec_length: product.specs["length"] ?? product.specs["size"] ?? product.specs["setup_size"] ?? null,
      spec_width: product.specs["width"] ?? null,
      spec_height: product.specs["height"] ?? null,
      spec_weight: product.specs["weight"] ?? null,
      spec_capacity: product.specs["capacity"] ?? product.specs["riders"] ?? null,
      spec_blower: product.specs["blower"] ?? product.specs["blowers_included"] ?? null,
      spec_material: product.specs["material"] ?? null,
      spec_setup_time: product.specs["setup_time"] ?? null,
      spec_age_range: product.specs["age_range"] ?? product.specs["recommended_age"] ?? product.specs["age"] ?? null,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(productRow)
      .select("id")
      .single();
    if (error) throw error;
    const productId = data!.id;

    if (product.images.length > 0) {
      const imageRows = product.images.slice(0, 10).map((img, i) => ({
        product_id: productId,
        url: img.url,
        alt: img.alt,
        position: i,
        is_primary: i === 0,
      }));
      const { error: imgError } = await supabase.from("product_images").insert(imageRows);
      if (imgError) console.warn(`  ⚠ Image insert error for ${product.name}:`, imgError.message);
    }

    if (product.features.length > 0) {
      const featureRows = product.features.map((feat, i) => ({
        product_id: productId,
        feature: feat,
        position: i,
      }));
      const { error: featError } = await supabase.from("product_features").insert(featureRows);
      if (featError) console.warn(`  ⚠ Feature insert error for ${product.name}:`, featError.message);
    }

    return "inserted";
  });
}

async function backfillMedia(productId: string, product: ScrapedProduct) {
  const { count: imageCount, error: imageCountError } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);
  if (imageCountError) throw imageCountError;

  if (!imageCount && product.images.length > 0) {
    const imageRows = product.images.slice(0, 10).map((img, i) => ({
      product_id: productId,
      url: img.url,
      alt: img.alt,
      position: i,
      is_primary: i === 0,
    }));
    const { error: imgError } = await supabase.from("product_images").insert(imageRows);
    if (imgError) console.warn(`  ⚠ Image insert error for ${product.name}:`, imgError.message);
  }

  const { count: featureCount, error: featureCountError } = await supabase
    .from("product_features")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);
  if (featureCountError) throw featureCountError;

  if (!featureCount && product.features.length > 0) {
    const featureRows = product.features.map((feat, i) => ({
      product_id: productId,
      feature: feat,
      position: i,
    }));
    const { error: featError } = await supabase.from("product_features").insert(featureRows);
    if (featError) console.warn(`  ⚠ Feature insert error for ${product.name}:`, featError.message);
  }
}

async function main() {
  console.log("🌟 Wonderland Inflatables - Product Scraper");
  console.log("============================================\n");

  const args = process.argv.slice(2);
  const scrapeOnly = args.includes("--dry-run");
  const fromCache = args.includes("--from-cache");
  const source = args.find((a) => a.startsWith("--source="))?.split("=")[1];

  if (!scrapeOnly && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  let allProducts: ScrapedProduct[] = [];
  const skipUrls = scrapeOnly || fromCache ? new Set<string>() : await loadExistingSourceUrls();
  if (skipUrls.size > 0) {
    console.log(`⏭  ${skipUrls.size} products already in Supabase will be skipped during scrape`);
  }

  if (fromCache) {
    allProducts = loadCache();
    if (source) allProducts = allProducts.filter((p) => p.source_site === source);
    if (allProducts.length === 0) {
      console.error("❌ No cached scrape at scripts/.scrape-cache.json. Run a full scrape first.");
      process.exit(1);
    }
    console.log(`📦 Loaded ${allProducts.length} products from cache`);
  } else {
    if (!source || source === "ultimatejumpers") {
      const ujProducts = await scrapeUltimateJumpers(skipUrls);
      allProducts.push(...ujProducts);
      console.log(`\n✓ Ultimate Jumpers: ${ujProducts.length} products scraped`);
    }

    if (!source || source === "jumporange") {
      const joProducts = await scrapeJumpOrange();
      allProducts.push(...joProducts);
      console.log(`\n✓ Jump Orange: ${joProducts.length} products scraped`);
    }
  }

  const seen = new Set<string>();
  allProducts = allProducts.filter((p): boolean => {
    const key = `${p.source_site}:${p.source_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  saveCache(mergeCache(loadCache(), allProducts));
  console.log(`\n📊 Total unique products: ${allProducts.length} (saved to scripts/.scrape-cache.json)`);

  if (scrapeOnly) {
    console.log("\n🔍 Dry run - skipping Supabase seed. Sample output:\n");
    console.log(JSON.stringify(allProducts.slice(0, 2), null, 2));
    return;
  }

  console.log("\n💾 Seeding Supabase (skips rows already in DB, retries network errors)…\n");
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of allProducts) {
    try {
      const result = await seedProduct(product);
      if (result === "skipped") {
        process.stdout.write(`  · ${product.name} (already in DB)\n`);
        skipped++;
      } else {
        process.stdout.write(`  ✓ ${product.name}\n`);
        inserted++;
      }
    } catch (err) {
      console.warn(`  ✗ ${product.name}: ${(err as Error).message}`);
      failed++;
    }
    await sleep(80);
  }

  console.log(`\n✅ Seeding complete: ${inserted} inserted, ${skipped} skipped, ${failed} failed`);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
