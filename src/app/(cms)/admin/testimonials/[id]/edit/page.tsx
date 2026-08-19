import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <div className="mb-6">
        <Link href="/admin/testimonials" className="text-xs text-orange-600 font-semibold hover:underline">
          Back to reviews
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Edit review</h1>
        <p className="text-slate-500 text-sm mt-0.5">{testimonial.name}</p>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
