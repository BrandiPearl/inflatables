import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { TestimonialForm } from "@/components/cms/testimonial-form";
import { getAdminTestimonial } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "Edit review" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getAdminTestimonial(id);
  if (!testimonial) notFound();

  return (
    <div>
      <AdminPageHeader
        backHref="/admin/testimonials"
        backLabel="Back to reviews"
        title="Edit review"
        description={testimonial.name}
      />
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
