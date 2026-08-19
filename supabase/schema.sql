-- ============================================================
-- Wonderland Inflatables — Supabase Schema
-- ============================================================
-- Run this in the Supabase SQL editor.
-- Schema mirrors the data shape from ultimatejumpers.com and
-- jumporange.com so the scraper/seeder can populate it directly.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUM types
-- ============================================================

create type product_category as enum (
  'bounce-houses',
  'water-slides',
  'combos',
  'obstacle-courses',
  'interactive',
  'tents-tables',
  'concessions',
  'generators',
  'other'
);

create type product_condition as enum ('new', 'used', 'refurbished');

create type quote_status as enum (
  'pending',
  'contacted',
  'quoted',
  'booked',
  'declined'
);

create type contact_status as enum ('new', 'read', 'replied', 'closed');

create type blog_post_status as enum ('draft', 'published', 'archived');

-- ============================================================
-- AUTHORS (for blog)
-- ============================================================

create table authors (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  bio         text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================

create table categories (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  description   text,
  image_url     text,
  parent_id     uuid references categories(id) on delete set null,
  position      int not null default 0,
  is_active     boolean not null default true,
  seo_title     text,
  seo_desc      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================

create table products (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text not null unique,
  sku                 text not null unique,
  name                text not null,
  description         text,
  short_description   text,
  price               numeric(10, 2) not null,
  compare_at_price    numeric(10, 2),
  category            product_category not null default 'other',
  subcategory         text,
  tags                text[] not null default '{}',

  -- Physical specs (matching scraped data from source sites)
  spec_length         text,         -- e.g. "28 ft"
  spec_width          text,
  spec_height         text,
  spec_weight         text,         -- e.g. "385 lbs"
  spec_capacity       text,         -- e.g. "2 riders"
  spec_blower         text,         -- e.g. "1.5 HP dual blowers included"
  spec_material       text,         -- e.g. "18oz commercial-grade PVC vinyl"
  spec_setup_time     text,
  spec_age_range      text,
  spec_outlet         text,         -- outlet requirement

  -- Content flags
  is_featured         boolean not null default false,
  is_new              boolean not null default false,
  in_stock            boolean not null default true,
  is_active           boolean not null default true,
  rental_available    boolean not null default true,
  purchase_available  boolean not null default true,

  -- SEO
  seo_title           text,
  seo_description     text,
  seo_keywords        text[],

  -- Source tracking (for scraper)
  source_url          text,
  source_site         text,         -- 'ultimatejumpers' | 'jumporange' | 'manual'
  source_id           text,         -- original product ID on source site

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index products_category_idx on products(category);
create index products_in_stock_idx on products(in_stock);
create index products_is_featured_idx on products(is_featured);
create index products_slug_idx on products(slug);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================

create table product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  alt         text not null default '',
  position    int not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index product_images_product_id_idx on product_images(product_id);

-- ============================================================
-- PRODUCT FEATURES (bullet points — scraped from source sites)
-- ============================================================

create table product_features (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  feature     text not null,
  position    int not null default 0
);

-- ============================================================
-- RELATED PRODUCTS (many-to-many)
-- ============================================================

create table product_relations (
  product_id    uuid not null references products(id) on delete cascade,
  related_id    uuid not null references products(id) on delete cascade,
  relation_type text not null default 'related', -- 'related' | 'upsell' | 'crosssell'
  primary key (product_id, related_id)
);

-- ============================================================
-- BLOG POSTS
-- ============================================================

create table blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  content       text,
  cover_image   text,
  author_id     uuid references authors(id) on delete set null,
  category      text not null default 'General',
  tags          text[] not null default '{}',
  status        blog_post_status not null default 'draft',
  read_time     int,              -- minutes
  seo_title     text,
  seo_desc      text,
  seo_keywords  text[],
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index blog_posts_status_idx on blog_posts(status);
create index blog_posts_published_at_idx on blog_posts(published_at);

-- ============================================================
-- QUOTE REQUESTS
-- ============================================================

create table quote_requests (
  id                    uuid primary key default uuid_generate_v4(),
  first_name            text not null,
  last_name             text not null,
  email                 text not null,
  phone                 text not null,
  event_date            date,
  event_type            text,
  event_address         text,
  city                  text,
  state                 text,
  zip                   text,
  guests_count          text,
  products_interested   text[],
  message               text,
  budget                text,
  how_did_you_hear      text,
  status                quote_status not null default 'pending',
  internal_notes        text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index quote_requests_status_idx on quote_requests(status);
create index quote_requests_created_at_idx on quote_requests(created_at);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================

create table contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  status      contact_status not null default 'new',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================

create table testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  location    text,
  rating      int not null default 5 check (rating between 1 and 5),
  review      text not null,
  event_type  text,
  avatar_url  text,
  is_featured boolean not null default false,
  is_active   boolean not null default true,
  date        date,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- CMS PAGES (for static/marketing pages)
-- ============================================================

create table cms_pages (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  title       text not null,
  content     jsonb,           -- structured content blocks (JSON)
  seo_title   text,
  seo_desc    text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- SITE SETTINGS (key-value store for CMS)
-- ============================================================

create table site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Cart checkout orders are stored in quote_requests with event_type = 'Purchase'.
-- products_interested holds line items; budget holds the cart subtotal.

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();

create trigger categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

create trigger quote_requests_updated_at
  before update on quote_requests
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Public read access for products, categories, blog posts, testimonials
alter table products enable row level security;
alter table categories enable row level security;
alter table product_images enable row level security;
alter table product_features enable row level security;
alter table blog_posts enable row level security;
alter table testimonials enable row level security;
alter table cms_pages enable row level security;
alter table site_settings enable row level security;

-- Protected write tables
alter table quote_requests enable row level security;
alter table contact_messages enable row level security;

create policy "Public read products"
  on products for select using (is_active = true);

create policy "Public read categories"
  on categories for select using (is_active = true);

create policy "Public read product images"
  on product_images for select using (true);

create policy "Public read product features"
  on product_features for select using (true);

create policy "Public read published blog posts"
  on blog_posts for select using (status = 'published');

alter table authors enable row level security;
create policy "Public read authors"
  on authors for select using (true);

create policy "Public read active testimonials"
  on testimonials for select using (is_active = true);

create policy "Public read active cms pages"
  on cms_pages for select using (is_active = true);

create policy "Public read site settings"
  on site_settings for select using (true);

-- Anyone can insert quote requests and contact messages (public form submissions)
create policy "Public insert quote requests"
  on quote_requests for insert with check (true);

create policy "Public insert contact messages"
  on contact_messages for insert with check (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these via the Supabase Storage API or dashboard:
--
-- insert into storage.buckets (id, name, public)
--   values ('product-images', 'product-images', true);
--
-- insert into storage.buckets (id, name, public)
--   values ('blog-images', 'blog-images', true);
--
-- insert into storage.buckets (id, name, public)
--   values ('team-images', 'team-images', true);
--
-- Storage RLS:
-- create policy "Public read product images"
--   on storage.objects for select
--   using (bucket_id = 'product-images');
--
-- create policy "Authenticated upload product images"
--   on storage.objects for insert
--   with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
