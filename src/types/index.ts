export type ProductCategory =
  | "bounce-houses"
  | "water-slides"
  | "combos"
  | "obstacle-courses"
  | "interactive"
  | "tents-tables"
  | "concessions"
  | "generators"
  | "other";

export type ProductCondition = "new" | "used" | "refurbished";

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  category: ProductCategory;
  subcategory?: string;
  tags: string[];
  images: ProductImage[];
  specs: ProductSpecs;
  features: string[];
  is_featured: boolean;
  is_new: boolean;
  in_stock: boolean;
  rental_available: boolean;
  purchase_available: boolean;
  capacity?: number;
  age_range?: string;
  dimensions?: ProductDimensions;
  weight?: number;
  material?: string;
  color?: string;
  theme?: string;
  created_at: string;
  updated_at: string;
  seo?: ProductSEO;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  is_primary: boolean;
}

export interface ProductSpecs {
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  capacity?: string;
  blower?: string;
  material?: string;
  setup_time?: string;
  age_range?: string;
  outlet_required?: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "ft" | "in" | "m";
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: ProductCategory;
  description: string;
  image_url: string;
  parent_id?: string;
  position: number;
  product_count?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: Author;
  category: string;
  tags: string[];
  published_at: string;
  updated_at: string;
  read_time: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface QuoteRequest {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_date: string;
  event_type: string;
  event_address: string;
  city: string;
  state: string;
  zip: string;
  guests_count: string;
  products_interested: string[];
  message: string;
  budget?: string;
  how_did_you_hear?: string;
  created_at?: string;
  status?: "pending" | "contacted" | "quoted" | "booked" | "declined";
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  event_type: string;
  avatar?: string;
  date: string;
}

export interface FilterState {
  category?: ProductCategory;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  inStock?: boolean;
  isNew?: boolean;
  rental?: boolean;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "az" | "za";
}
