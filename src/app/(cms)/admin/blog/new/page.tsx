import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { BlogForm } from "@/components/cms/blog-form";
import { getAuthors } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "New post" };

export default async function NewBlogPage() {
  const authors = await getAuthors();

  return (
    <div>
      <AdminPageHeader
        backHref="/admin/blog"
        backLabel="Back to blog"
        title="New post"
        description="Write a draft or publish it to the blog."
      />
      <BlogForm authors={authors} />
    </div>
  );
}
