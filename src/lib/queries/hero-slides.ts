import { isSupabaseConfigured } from "@/lib/supabase/config";

export type HeroSlide = {
  src: string;
  alt: string;
  focal?: string;
  label?: string;
};

const EXCITING_NAME =
  /dragon|gummy|shark|mermaid|t-rex|trex|ape|ocean|party|jungle|pirate|castle|rainbow|tropical|obstacle|giant|mega|dual|combo|wave|safari|unicorn|dinosaur|enchanted|amalfi|splatter|ice pop|block party|adrenaline|paint|bungee|monster|deep sea|offshore|pool party|mindset|scooppin|hidden jaguar|beach camper|melting arctic|100.?ft|88.?ft|67.?ft/;

/** Hand-picked hero shots: full-bleed product art and live-event photography. */
const CURATED_SLIDES: HeroSlide[] = [
  {
    src: "/images/hero-inflatables.jpg",
    alt: "Commercial inflatables set up at a summer outdoor event",
    focal: "68% 32%",
    label: "Live events",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0024/3089/4141/files/JCXD-WS28AE_WEB1.jpg?v=1767661383",
    alt: "Ape Escape 28ft commercial water slide",
    focal: "55% 45%",
    label: "28ft water slides",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0024/3089/4141/files/JCXD-WS25MD_WEB1.jpg?v=1758743836",
    alt: "Monster Dragon 25ft inflatable water slide",
    focal: "center",
    label: "Monster Dragon",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0024/3089/4141/files/JCXD-WS25GB_WEB1.jpg?v=1758743666",
    alt: "Gummy Bears 25ft colorful water slide",
    focal: "center",
    label: "Gummy Bears slide",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0024/3089/4141/files/JC-WSD22SS_WEB1.jpg?v=1764638975",
    alt: "Shark Sighted dual lane 24ft water slide",
    focal: "52% 40%",
    label: "Dual lane slides",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0024/3089/4141/files/JCX-CFD32BAM_WEB1.jpg?v=1764639638",
    alt: "Melting Arctic dual lane wet and dry combo",
    focal: "center",
    label: "Wet & dry combos",
  },
];

function isHeroImage(url: string) {
  const u = url.toLowerCase();
  return (
    u.startsWith("http") &&
    !u.includes("logo") &&
    !u.endsWith(".svg") &&
    !u.includes("-150x150") &&
    !u.includes("-410x356") &&
    !u.includes("-300x")
  );
}

function scoreProduct(name: string, url: string, price: number, category: string) {
  let score = price / 1000;
  const u = url.toLowerCase();
  const n = name.toLowerCase();

  if (u.includes("cdn.shopify.com")) score += 80;
  if (u.includes("_web") || u.includes("web1")) score += 15;
  if (EXCITING_NAME.test(n)) score += 35;
  if (category === "water-slides") score += 10;
  if (category === "combos" || category === "obstacle-courses") score += 8;
  if (u.endsWith(".png") && !u.includes("_web")) score -= 5;

  return score;
}

function labelFor(name: string, category: string) {
  const n = name.toLowerCase();
  if (/obstacle|adrenaline|block party/.test(n)) return "Obstacle courses";
  if (/combo|dual lane|wet/.test(n)) return "Combo units";
  if (/bounce|castle|jumper/.test(n)) return "Bounce houses";
  if (/slide|shark|dragon|mermaid|ape|t-rex|gummy|ocean|party/.test(n)) {
    const short = name.split(/\s+/).slice(0, 3).join(" ");
    return short.length > 22 ? "Water slides" : short;
  }
  const map: Record<string, string> = {
    "water-slides": "Water slides",
    "bounce-houses": "Bounce houses",
    "obstacle-courses": "Obstacle courses",
    combos: "Combo units",
    interactive: "Interactive games",
  };
  return map[category] ?? "Commercial units";
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const eventSlide = CURATED_SLIDES[0];
  const slides: HeroSlide[] = [eventSlide];
  const seen = new Set<string>([eventSlide.src]);

  if (!isSupabaseConfigured()) {
    return CURATED_SLIDES;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("name, category, price, product_images(url, is_primary, position)")
      .eq("is_active", true)
      .order("price", { ascending: false })
      .limit(120);

    if (error || !data?.length) {
      return CURATED_SLIDES;
    }

    type Candidate = HeroSlide & { score: number; category: string };
    const candidates: Candidate[] = [];

    for (const row of data) {
      const name = String(row.name ?? "");
      const category = String(row.category ?? "other");
      const images = ((row.product_images as { url: string; is_primary: boolean; position: number }[]) ?? [])
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position)
        .map((img) => String(img.url ?? ""));

      const url = images.find(isHeroImage);
      if (!url || seen.has(url)) continue;

      candidates.push({
        src: url,
        alt: name,
        focal: "center",
        label: labelFor(name, category),
        score: scoreProduct(name, url, Number(row.price ?? 0), category),
        category,
      });
    }

    candidates.sort((a, b) => b.score - a.score);

    const categoryUsed = new Set<string>();
    for (const candidate of candidates) {
      if (slides.length >= 6) break;
      if (categoryUsed.has(candidate.category) && candidate.score < 70) continue;
      categoryUsed.add(candidate.category);
      seen.add(candidate.src);
      slides.push({
        src: candidate.src,
        alt: candidate.alt,
        focal: candidate.focal,
        label: candidate.label,
      });
    }

    for (const fallback of CURATED_SLIDES.slice(1)) {
      if (slides.length >= 6) break;
      if (seen.has(fallback.src)) continue;
      seen.add(fallback.src);
      slides.push(fallback);
    }

    return slides.length > 1 ? slides : CURATED_SLIDES;
  } catch {
    return CURATED_SLIDES;
  }
}
