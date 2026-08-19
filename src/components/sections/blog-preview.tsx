import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/queries/blog";
import { CoverImage } from "@/components/ui/cover-image";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Lead story plus a ruled index, in the manner of a trade publication.
 * Replaces three identical bordered cards each carrying an avatar chip.
 */
export async function BlogPreview() {
  const posts = await getBlogPosts(4);
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;

  return (
    <section className="section-block border-t border-slate-200">
      <div className="container-wide">
        <div className="section-intro flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="eyebrow">Field notes</p>
            <h2 className="section-heading">Resources for rental operators</h2>
          </div>
          <Link href="/blog" className="link-arrow">
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          {/* Lead */}
          <Link href={`/blog/${lead.slug}`} className="group lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
              <CoverImage
                src={lead.cover_image}
                alt={lead.title}
                sizes="(max-width: 1024px) 100vw, 58vw"
                fallbackLabel={lead.category}
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="badge-orange">{lead.category}</span>
              <span className="spec text-[0.6875rem] text-slate-500">
                {lead.read_time} min read
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-orange-700 sm:text-[1.75rem]">
              {lead.title}
            </h3>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-slate-600 line-clamp-3">
              {lead.excerpt}
            </p>
            <p className="spec mt-5 text-[0.6875rem] uppercase tracking-[0.14em] text-slate-500">
              {lead.author.name} · {formatDate(lead.published_at)}
            </p>
          </Link>

          {/* Index */}
          {rest.length > 0 && (
            <div className="lg:col-span-5">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block border-t border-slate-200 py-6 first:border-slate-900 first:pt-0 lg:first:pt-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="spec text-[0.625rem] uppercase tracking-[0.16em] text-orange-700">
                      {post.category}
                    </span>
                    <span className="spec text-[0.625rem] text-slate-400">
                      {post.read_time} min
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-base font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-orange-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="spec mt-3 text-[0.6875rem] text-slate-400">
                    {formatDate(post.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
