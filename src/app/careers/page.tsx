import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoCta } from "@/components/layout/info-page";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Wonderland Inflatables. We're hiring in sales, warehouse, and customer support at our Ontario, CA headquarters.",
};

const OPENINGS = [
  {
    title: "Inside Sales Specialist",
    location: "Ontario, CA / Remote US",
    type: "Full-time",
    summary:
      "Help rental operators choose the right fleet. You'll quote orders, walk customers through specs, and own the relationship from first call to delivery.",
  },
  {
    title: "Warehouse Associate",
    location: "Ontario, CA",
    type: "Full-time",
    summary:
      "Inspect, pack, and ship commercial inflatables. Forklift experience is a plus. Day shift, Monday-Friday.",
  },
  {
    title: "Customer Support Coordinator",
    location: "Ontario, CA / Remote US",
    type: "Full-time",
    summary:
      "Handle warranty claims, freight questions, and setup support. You need to be calm, clear, and fast on email and phone.",
  },
];

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Careers"
      intro="We're a small team that sells commercial inflatables to rental operators nationwide. If you like practical work, honest products, and talking to business owners, we'd like to hear from you."
    >
      <InfoSection title="Open roles">
        <div className="space-y-4 not-prose">
          {OPENINGS.map((job) => (
            <div
              key={job.title}
              className="rounded-xl border border-slate-100 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                <span className="text-xs text-slate-400">
                  {job.type} · {job.location}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{job.summary}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="How to apply">
        <p>
          Email a short note and your resume to{" "}
          <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">
            {BUSINESS_EMAIL}
          </a>
          . Tell us which role you're interested in and why. We read every application
          and typically respond within a week.
        </p>
      </InfoSection>

      <InfoCta
        title="Don't see the right role?"
        body="Send us a note anyway. We keep a small bench of people we want to work with."
        href={mailHref(BUSINESS_EMAIL)}
        label="Email us"
      />
    </InfoPage>
  );
}
