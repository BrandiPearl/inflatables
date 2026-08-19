import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/queries/blog";
import { CoverImage } from "@/components/ui/cover-image";

export const metadata: Metadata = {
  title: "Inflatable Business Resources & Tips",
  description:
    "Expert guides, business tips, and product advice for inflatable rental operators. Learn how to start, grow, and run a profitable bounce house business.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts(24);
  const [featured, ...rest] = posts;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container-wide py-12">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
            Resources
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            The Wonderland Blog
          </h1>
          <p className="mt-2 text-slate-500 text-sm max-w-xl">
            Tips, guides, and insights for inflatable rental business owners and event
            professionals.
          </p>
        </div>
      </div>

      <div className="container-wide py-12">
        {posts.length === 0 && (
          <p className="text-slate-500 text-sm">No articles published yet.</p>
        )}

        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="aspect-video md:aspect-auto bg-slate-100 relative min-h-48">
              <CoverImage
                src={featured.cover_image}
                alt={featured.title}
                sizes="(max-width: 768px) 100vw, 50vw"
                fallbackLabel="Featured Article"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-orange">{featured.category}</span>
                <span className="text-xs text-slate-400">{featured.read_time} min read</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-orange-600">
                Read article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <CoverImage
                  src={post.cover_image}
                  alt={post.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  fallbackLabel={post.category}
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="badge-orange">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.read_time} min read</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  {formatDate(post.published_at)} · By {post.author.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
