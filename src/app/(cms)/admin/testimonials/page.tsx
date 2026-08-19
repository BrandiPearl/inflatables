import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { getAdminTestimonials } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "Reviews" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description={`${testimonials.length} testimonials on the homepage`}
        actions={
          <Link href="/admin/testimonials/new" className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Add review
          </Link>
        }
      />

      <div className="space-y-3">
        {testimonials.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            No testimonials yet.
          </div>
        ) : (
          testimonials.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  {item.location ? <span className="text-xs text-slate-400">{item.location}</span> : null}
                  <span className={`text-xs font-semibold ${item.is_active ? "text-emerald-600" : "text-slate-400"}`}>
                    {item.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{item.review}</p>
              </div>
              <Link
                href={`/admin/testimonials/${item.id}/edit`}
                className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors h-fit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
