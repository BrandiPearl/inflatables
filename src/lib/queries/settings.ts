import { isSupabaseConfigured } from "@/lib/supabase/config";
import { BUSINESS_EMAIL, BUSINESS_PHONE_DISPLAY } from "@/lib/contact-info";

export type SiteSettings = {
  business_name: string;
  phone: string;
  email: string;
  address: string;
  seo_title: string;
  seo_description: string;
  announcement: string;
  announcement_link_text: string;
  announcement_link_url: string;
};

const SETTING_DEFAULTS: SiteSettings = {
  business_name: "Wonderland Inflatables",
  phone: BUSINESS_PHONE_DISPLAY,
  email: BUSINESS_EMAIL,
  address: "3200 Commerce Blvd, Ontario, CA 91761",
  seo_title: "Wonderland Inflatables | Commercial Bounce Houses & Water Slides",
  seo_description:
    "Commercial grade bounce houses, water slides, obstacle courses, and combos for rental businesses and large events. Ships to all 48 states. ASTM certified.",
  announcement: "Free shipping on orders over $2,500",
  announcement_link_text: "Get a free quote today",
  announcement_link_url: "/quote",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return SETTING_DEFAULTS;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key, value");

  if (error || !data?.length) {
    if (error) console.error("getSiteSettings:", error.message);
    return SETTING_DEFAULTS;
  }

  const map = Object.fromEntries(
    data.map((row) => [String(row.key), row.value])
  ) as Record<string, unknown>;

  const str = (key: keyof SiteSettings) => {
    const raw = map[key];
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object" && "value" in (raw as object)) {
      return String((raw as { value: unknown }).value);
    }
    return SETTING_DEFAULTS[key];
  };

  const phoneRaw = str("phone");
  const emailRaw = str("email");

  return {
    business_name: str("business_name"),
    phone:
      !phoneRaw || /555-1234|18005551234/.test(phoneRaw)
        ? BUSINESS_PHONE_DISPLAY
        : phoneRaw,
    email:
      !emailRaw || /hello@wonderlandinflatables\.com/i.test(emailRaw)
        ? BUSINESS_EMAIL
        : emailRaw,
    address: str("address"),
    seo_title: str("seo_title"),
    seo_description: str("seo_description"),
    announcement: str("announcement"),
    announcement_link_text: str("announcement_link_text"),
    announcement_link_url: str("announcement_link_url"),
  };
}
