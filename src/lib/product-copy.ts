import type { ProductSpecs } from "@/types";

const JUNK_FEATURE =
  /^(description|additional info|item includes|reviews?|related products|write a review|be the first to review.*|no approved reviews.*|\d\s*stars?\s*\d*%?)$/i;

export function isUsefulFeature(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length < 8 || t.length > 220) return false;
  if (JUNK_FEATURE.test(t)) return false;
  if (/^\d\s*star/i.test(t)) return false;
  if (/^item includes$/i.test(t)) return false;
  return true;
}

export function cleanProductDescription(raw: string, name: string): string {
  let text = raw.replace(/\s+/g, " ").trim();
  if (!text) return "";

  text = text.replace(
    /^(description|additional info|item includes|reviews?)\s*/gi,
    ""
  );
  text = text.replace(/\d\s*Star\s*\d*%/gi, " ");
  text = text.replace(/No approved reviews yet\.?/gi, " ");
  text = text.replace(/Write a [Rr]eview/gi, " ");
  text = text.replace(/Be the first to review.*$/gi, " ");
  text = text.replace(/\s+/g, " ").trim();

  if (name) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[′']/g, "[′']");
    text = text.replace(new RegExp(`^${escaped}\\s*`, "i"), "").trim();
    text = text.replace(new RegExp(`^${escaped}(?=[A-Z])`, "i"), "").trim();
  }

  return text;
}

export function descriptionParagraphs(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/(?<=\.)\s+(?=[A-Z])/).filter((p) => p.length > 40);
  if (parts.length >= 2) return parts.slice(0, 6);
  return [cleaned];
}

export function specsFromCopy(
  existing: ProductSpecs,
  name: string,
  features: string[],
  description: string
): ProductSpecs {
  const specs: ProductSpecs = { ...existing };
  const blob = [name, ...features, description].join(" | ");

  const assign = (key: keyof ProductSpecs, value?: string) => {
    if (!specs[key] && value) specs[key] = value;
  };

  for (const feature of features) {
    const match = feature.match(/^([A-Za-z][A-Za-z0-9 /_-]{1,28}):\s*(.+)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
    const val = match[2].trim();
    if (key.includes("size") || key.includes("dimension")) assign("length", val);
    else if (key.includes("height")) assign("height", val);
    else if (key.includes("width")) assign("width", val);
    else if (key.includes("length")) assign("length", val);
    else if (key.includes("weight")) assign("weight", val);
    else if (key.includes("capacit") || key.includes("occup")) assign("capacity", val);
    else if (key.includes("blower")) assign("blower", val);
    else if (key.includes("material") || key.includes("vinyl")) assign("material", val);
    else if (key.includes("age")) assign("age_range", val);
    else if (key.includes("setup")) assign("setup_time", val);
  }

  const heightFromName = name.match(/(\d+)\s*[′']/);
  assign("height", heightFromName ? `${heightFromName[1]} ft` : undefined);

  const size = blob.match(
    /(\d+(?:\.\d+)?)\s*(?:ft|feet|′|'')\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:ft|feet|′|'')?(?:\s*[x×]\s*(\d+(?:\.\d+)?))?/i
  );
  if (size) {
    assign("length", `${size[1]} ft`);
    assign("width", `${size[2]} ft`);
    if (size[3]) assign("height", `${size[3]} ft`);
  }

  const weight = blob.match(/(\d[\d,]*)\s*(?:lbs?|pounds)/i);
  assign("weight", weight ? `${weight[1]} lbs` : undefined);

  if (/18oz|commercial[- ]grade|pvc vinyl/i.test(blob)) {
    assign("material", "Commercial grade PVC vinyl");
  }

  const riders = blob.match(/(\d+)\s*(?:riders?|occupants?|people)/i);
  assign("capacity", riders ? `${riders[1]} riders` : undefined);

  return specs;
}
