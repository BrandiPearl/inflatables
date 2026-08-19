import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { getAdminBlogPosts } from "@/lib/queries/blog";

export const metadata: Metadata = { title: "Blog" };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-amber-50 text-amber-700",
};

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-0.5">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        {posts.length === 0 ? (
          <p className="p-8 text-sm text-slate-500">No blog posts yet. Seed content with npm run seed:content.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Published</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 leading-snug">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{post.read_time} min read</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{post.author.name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="badge-orange">{post.category}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">
                    {post.published_at ? formatDate(post.published_at) : "Not published"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[post.status] ?? "bg-slate-100 text-slate-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/admin/blog/${post.id}/edit`} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
