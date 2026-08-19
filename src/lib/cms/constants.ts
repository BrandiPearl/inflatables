import type { ProductCategory } from "@/types";

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "bounce-houses", label: "Bounce Houses" },
  { value: "water-slides", label: "Water Slides" },
  { value: "combos", label: "Combo Units" },
  { value: "obstacle-courses", label: "Obstacle Courses" },
  { value: "interactive", label: "Interactive Games" },
  { value: "tents-tables", label: "Tents & Tables" },
  { value: "concessions", label: "Concessions" },
  { value: "generators", label: "Generators" },
  { value: "other", label: "Other" },
];

export const BLOG_CATEGORIES = [
  "Buying Guide",
  "Operations",
  "Safety",
  "Events",
  "Maintenance",
  "General",
];

export const QUOTE_STATUSES = ["pending", "contacted", "quoted", "booked", "declined"] as const;
export const CONTACT_STATUSES = ["new", "read", "replied", "closed"] as const;
export const BLOG_STATUSES = ["draft", "published", "archived"] as const;
