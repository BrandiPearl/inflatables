import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
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
      <AdminPageHeader
        backHref="/admin/blog"
        backLabel="Back to blog"
        title="Edit post"
        description={post.title}
      />
      <BlogForm post={post} authors={authors} />
    </div>
  );
}
