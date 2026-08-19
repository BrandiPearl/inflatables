import type { ProductImage } from "@/types";

/** Skip logos, SVGs, and mock paths that are not real files. */
export function isUsableProductImage(url: string | undefined | null): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  if (url.startsWith("/images/products/")) return false;
  if (u.includes("logo") || u.includes("favicon")) return false;
  if (u.endsWith(".svg")) return false;
  return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/");
}

/** WordPress size suffix (-150x150, -410x410) → original file. */
export function wordpressFullSize(url: string): string {
  return url.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp|gif))/i, "");
}

function skuToken(sku: string): string {
  return sku.replace(/^[A-Z]{2}-/i, "").toLowerCase();
}

function looksLikeOtherProductSku(url: string, token: string): boolean {
  const file = (url.split("/").pop() ?? "").toLowerCase();
  const codes = file.match(/[a-z]\d{2,}/g) ?? [];
  return codes.some((code) => code !== token);
}

function markPrimary(images: ProductImage[]): ProductImage[] {
  return images.map((img, i) => ({ ...img, is_primary: i === 0 }));
}

export function selectProductImages(
  images: ProductImage[],
  sku: string
): ProductImage[] {
  const seen = new Set<string>();
  const usable: ProductImage[] = [];

  for (const img of [...images].sort((a, b) => a.position - b.position)) {
    const url = wordpressFullSize(img.url);
    if (!isUsableProductImage(url) || seen.has(url)) continue;
    seen.add(url);
    usable.push({ ...img, url });
  }

  const token = skuToken(sku);
  const skuHits =
    token.length >= 3
      ? usable.filter((img) => img.url.toLowerCase().includes(token))
      : [];
  if (skuHits.length > 0) return markPrimary(skuHits);

  const own = token
    ? usable.filter((img) => !looksLikeOtherProductSku(img.url, token))
    : usable;
  return markPrimary(own.length > 0 ? own : usable);
}
