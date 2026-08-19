import type { Testimonial } from "@/types";
import { TESTIMONIALS } from "@/lib/data/mock-products";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function mapRow(row: Record<string, unknown>): Testimonial {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    location: String(row.location ?? ""),
    rating: Number(row.rating ?? 5),
    review: String(row.review ?? ""),
    event_type: String(row.event_type ?? ""),
    avatar: row.avatar_url ? String(row.avatar_url) : undefined,
    date: String(row.date ?? row.created_at ?? ""),
  };
}

export async function getTestimonials(limit = 8): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return TESTIMONIALS.slice(0, limit);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getTestimonials:", error.message);
    return TESTIMONIALS.slice(0, limit);
  }

  const rows = (data ?? []).map(mapRow);
  return rows.length > 0 ? rows : TESTIMONIALS.slice(0, limit);
}
