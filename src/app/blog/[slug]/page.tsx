import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogPostBySlug, getRelatedBlogPosts, getBlogSlugs } from "@/lib/queries/blog";
import { CoverImage } from "@/components/ui/cover-image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    alternates: {
      canonical: `https://wonderlandinflatables.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author.name],
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticleBody({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  return (
    <article className="prose prose-slate prose-base max-w-none">
      {paragraphs.map((paragraph, i) => {
        const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="mb-5 text-slate-700 leading-7">
            {parts.map((part, j) =>
              part.startsWith("**") ? (
                <strong key={j} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </article>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(slug, 2);

  return (
    <div className="bg-white">
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-slate-700 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="badge-orange mb-4 inline-block">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-slate-600">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs">{post.author.name}</div>
                  {post.author.bio && (
                    <div className="text-xs text-slate-400">{post.author.bio}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.published_at)}
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.read_time} min read
              </div>
            </div>
          </div>

          <div className="aspect-video bg-slate-100 rounded-2xl mb-10 relative overflow-hidden">
            <CoverImage
              src={post.cover_image}
              alt={post.title}
              sizes="(max-width: 768px) 100vw, 768px"
              fallbackLabel={post.category}
            />
          </div>

          <ArticleBody content={post.content || post.excerpt} />

          {post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="badge-slate">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-orange-600 p-8 text-white">
            <h3 className="text-xl font-bold">Ready to get started?</h3>
            <p className="mt-2 text-orange-100 text-sm leading-relaxed">
              Browse our full catalog of commercial grade inflatables, built for rental
              operators who take their business seriously.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
            <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-100 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">More articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-all"
                >
                  <div className="aspect-video bg-slate-100 relative">
                    <CoverImage
                      src={p.cover_image}
                      alt={p.title}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      fallbackLabel={p.category}
                    />
                  </div>
                  <div className="p-4">
                    <span className="badge-orange mb-2 inline-block">{p.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover_image || undefined,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: {
              "@type": "Person",
              name: post.author.name,
            },
            publisher: {
              "@type": "Organization",
              name: "Wonderland Inflatables",
              url: "https://wonderlandinflatables.com",
            },
            url: `https://wonderlandinflatables.com/blog/${post.slug}`,
            keywords: post.tags.join(", "),
          }),
        }}
      />
    </div>
  );
}
