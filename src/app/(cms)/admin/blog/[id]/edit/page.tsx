import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogForm } from "@/components/cms/blog-form";
import { getAdminBlogPost } from "@/lib/queries/blog";
import { getAuthors } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, authors] = await Promise.all([getAdminBlogPost(id), getAuthors()]);
  if (!post) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/blog" className="text-xs text-orange-600 font-semibold hover:underline">
          Back to blog
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Edit post</h1>
        <p className="text-slate-500 text-sm mt-0.5">{post.title}</p>
      </div>
      <BlogForm post={post} authors={authors} />
    </div>
  );
}
