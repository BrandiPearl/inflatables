import type { Metadata } from "next";
import Link from "next/link";
import { BlogForm } from "@/components/cms/blog-form";
import { getAuthors } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "New post" };

export default async function NewBlogPage() {
  const authors = await getAuthors();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/blog" className="text-xs text-orange-600 font-semibold hover:underline">
          Back to blog
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">New Post</h1>
        <p className="text-slate-500 text-sm mt-0.5">Write a draft or publish it to the blog.</p>
      </div>
      <BlogForm authors={authors} />
    </div>
  );
}
