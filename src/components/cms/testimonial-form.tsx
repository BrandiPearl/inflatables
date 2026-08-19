"use client";

import { useActionState } from "react";
import { saveTestimonial, deleteTestimonial } from "@/app/(cms)/admin/actions";
import type { ActionState } from "@/lib/cms/form";
import type { AdminTestimonial } from "@/lib/queries/cms";
import { FormAlert } from "@/components/cms/form-alert";

export function TestimonialForm({ testimonial }: { testimonial?: AdminTestimonial }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveTestimonial, null);

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
      <FormAlert state={state} />

      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name">
            <input name="name" className="input" required defaultValue={testimonial?.name} />
          </Field>
          <Field label="Location">
            <input name="location" className="input" defaultValue={testimonial?.location} />
          </Field>
          <Field label="Event type">
            <input name="event_type" className="input" defaultValue={testimonial?.event_type} />
          </Field>
          <Field label="Rating">
            <select name="rating" className="input" defaultValue={String(testimonial?.rating ?? 5)}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input name="date" type="date" className="input" defaultValue={testimonial?.date?.slice(0, 10)} />
          </Field>
          <Field label="Avatar URL">
            <input name="avatar_url" className="input" defaultValue={testimonial?.avatar_url} />
          </Field>
        </div>
        <Field label="Review">
          <textarea name="review" className="input" rows={6} required defaultValue={testimonial?.review} />
        </Field>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="is_active" defaultChecked={testimonial?.is_active ?? true} className="rounded border-slate-300" />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="is_featured" defaultChecked={testimonial?.is_featured} className="rounded border-slate-300" />
            Featured
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary text-sm py-2 px-4" disabled={pending}>
          {pending ? "Saving…" : testimonial ? "Save review" : "Add review"}
        </button>
        {testimonial ? (
          <button
            formAction={deleteTestimonial}
            className="btn-secondary text-sm py-2 px-4 text-red-600"
            onClick={(event) => {
              if (!confirm("Delete this testimonial?")) event.preventDefault();
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
