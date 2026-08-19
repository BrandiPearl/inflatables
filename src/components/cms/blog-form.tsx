"use client";

import { useActionState, useMemo, useState } from "react";
import { saveBlogPost, deleteBlogPost } from "@/app/(cms)/admin/actions";
import { BLOG_CATEGORIES, BLOG_STATUSES } from "@/lib/cms/constants";
import type { ActionState } from "@/lib/cms/form";
import type { AdminAuthor } from "@/lib/queries/cms";
import type { AdminBlogPost } from "@/lib/queries/blog";
import { slugify } from "@/lib/utils";
import { FormAlert } from "@/components/cms/form-alert";

export function BlogForm({
  post,
  authors,
}: {
  post?: AdminBlogPost;
  authors: AdminAuthor[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveBlogPost, null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const slugLocked = Boolean(post);
  const derivedSlug = useMemo(() => (slugLocked ? slug : slugify(title) || slug), [title, slug, slugLocked]);

  return (
    <form action={action} className="space-y-6 max-w-4xl">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      {post?.published_at ? <input type="hidden" name="published_at" value={post.published_at} /> : null}
      <FormAlert state={state} />

      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Post</h2>
        <Field label="Title">
          <input name="title" className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Slug">
            <input
              name="slug"
              className="input font-mono text-xs"
              value={slugLocked ? slug : derivedSlug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </Field>
          <Field label="Status">
            <select name="status" className="input" defaultValue={post?.status ?? "draft"}>
              {BLOG_STATUSES.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select name="category" className="input" defaultValue={post?.category ?? "General"}>
              {BLOG_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Author">
            <select name="author_id" className="input" defaultValue={post?.author_id ?? ""}>
              <option value="">Unassigned</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Read time (minutes)">
            <input name="read_time" type="number" min="1" className="input" defaultValue={post?.read_time ?? 5} />
          </Field>
          <Field label="Cover image URL">
            <input name="cover_image" className="input" defaultValue={post?.cover_image} />
          </Field>
        </div>
        <Field label="Excerpt">
          <textarea name="excerpt" className="input" rows={3} defaultValue={post?.excerpt} />
        </Field>
        <Field label="Content">
          <textarea name="content" className="input font-mono text-sm min-h-80" rows={16} defaultValue={post?.content} />
        </Field>
        <Field label="Tags">
          <input name="tags" className="input" defaultValue={post?.tags.join(", ")} />
        </Field>
        <Field label="SEO title">
          <input name="seo_title" className="input" defaultValue={post?.seo_title} />
        </Field>
        <Field label="SEO description">
          <textarea name="seo_desc" className="input" rows={2} defaultValue={post?.seo_desc} />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary text-sm py-2 px-4" disabled={pending}>
          {pending ? "Saving…" : post ? "Save post" : "Create post"}
        </button>
        {post ? (
          <button
            formAction={deleteBlogPost}
            className="btn-secondary text-sm py-2 px-4 text-red-600"
            onClick={(event) => {
              if (!confirm("Delete this post? This cannot be undone.")) event.preventDefault();
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
