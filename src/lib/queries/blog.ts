import type { BlogPost } from "@/types";
import { BLOG_POSTS } from "@/lib/data/mock-products";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";

async function blogClient() {
  const admin = createAdminClient();
  if (admin) return admin;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function mapRow(row: Record<string, unknown>): BlogPost {
  const author = ((row.author ?? row.authors) ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    cover_image: String(row.cover_image ?? ""),
    author: {
      id: String(author.id ?? ""),
      name: String(author.name ?? "Wonderland Team"),
      avatar: author.avatar_url ? String(author.avatar_url) : undefined,
      bio: author.bio ? String(author.bio) : undefined,
    },
    category: String(row.category ?? "General"),
    tags: (row.tags as string[]) ?? [],
    published_at: String(row.published_at ?? row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    read_time: Number(row.read_time ?? 5),
    seo: row.seo_title
      ? {
          title: String(row.seo_title),
          description: String(row.seo_desc ?? ""),
          keywords: (row.seo_keywords as string[]) ?? [],
        }
      : undefined,
  };
}

export async function getBlogPosts(limit = 20): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return BLOG_POSTS.slice(0, limit);

  const supabase = await blogClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, author:authors(*)`)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getBlogPosts:", error.message);
    return BLOG_POSTS.slice(0, limit);
  }

  const posts = (data ?? []).map(mapRow);
  return posts.length > 0 ? posts : BLOG_POSTS.slice(0, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = await blogClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, author:authors(*)`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getBlogPostBySlug:", error.message);
    return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
  if (!data) return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  return mapRow(data as Record<string, unknown>);
}

export async function getRelatedBlogPosts(slug: string, limit = 2): Promise<BlogPost[]> {
  const posts = await getBlogPosts(12);
  return posts.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function getBlogSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const posts = await getBlogPosts(50);
  return posts.map((p) => ({ slug: p.slug, updated_at: p.updated_at || p.published_at }));
}

export type AdminBlogPost = BlogPost & {
  status: string;
  author_id: string;
  seo_title: string;
  seo_desc: string;
};

export async function getAdminBlogPost(id: string): Promise<AdminBlogPost | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("blog_posts")
    .select(`*, author:authors(*)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getAdminBlogPost:", error.message);
    return null;
  }

  const row = data as Record<string, unknown>;
  return {
    ...mapRow(row),
    status: String(row.status ?? "draft"),
    author_id: String(row.author_id ?? ""),
    seo_title: String(row.seo_title ?? ""),
    seo_desc: String(row.seo_desc ?? ""),
  };
}

export async function getAdminBlogPosts(): Promise<(BlogPost & { status: string })[]> {
  const admin = createAdminClient();
  if (!admin) {
    return (await getBlogPosts(50)).map((p) => ({ ...p, status: "published" }));
  }

  const { data, error } = await admin
    .from("blog_posts")
    .select(`*, author:authors(*)`)
    .order("published_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    console.error("getAdminBlogPosts:", error?.message);
    return (await getBlogPosts(50)).map((p) => ({ ...p, status: "published" }));
  }

  return data.map((row) => ({
    ...mapRow(row as Record<string, unknown>),
    status: String(row.status ?? "draft"),
  }));
}
