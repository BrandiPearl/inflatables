import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { TestimonialForm } from "@/components/cms/testimonial-form";

export const metadata: Metadata = { title: "New review" };

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminPageHeader
        backHref="/admin/testimonials"
        backLabel="Back to reviews"
        title="Add review"
        description="Add a customer testimonial for the homepage."
      />
      <TestimonialForm />
    </div>
  );
}
