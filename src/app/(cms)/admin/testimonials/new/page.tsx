import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialForm } from "@/components/cms/testimonial-form";

export const metadata: Metadata = { title: "New review" };

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/testimonials" className="text-xs text-orange-600 font-semibold hover:underline">
          Back to reviews
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Add review</h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
