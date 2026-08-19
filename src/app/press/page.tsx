import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoCta } from "@/components/layout/info-page";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Press and media resources for Wonderland Inflatables. Brand facts, contact, and logo usage.",
};

export default function PressPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Press"
      intro="Media inquiries, brand facts, and how to reach our team. For product photography or interviews, email us and we'll respond the same business day."
    >
      <InfoSection title="Boilerplate">
        <p>
          Wonderland Inflatables manufactures commercial grade bounce houses, water
          slides, obstacle courses, and combo units for rental businesses and large
          events. Founded in 2008 in Ontario, California, the company has delivered
          more than 12,000 units to operators in all 48 contiguous US states. Products
          are built from 18oz PVC vinyl and meet ASTM F2374 commercial inflatable
          standards.
        </p>
      </InfoSection>

      <InfoSection title="Quick facts">
        <ul>
          <li>Founded: 2008, Ontario, CA</li>
          <li>Units delivered: 12,000+</li>
          <li>States served: 48</li>
          <li>Headquarters: 3200 Commerce Blvd, Ontario, CA 91761</li>
          <li>Email: {BUSINESS_EMAIL}</li>
        </ul>
      </InfoSection>

      <InfoSection title="Media contact">
        <p>
          Email{" "}
          <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">
            {BUSINESS_EMAIL}
          </a>
          . Please include your outlet, deadline, and what you need (quote, photos,
          or a spokesperson).
        </p>
      </InfoSection>

      <InfoCta
        title="Need product photos or a quote?"
        body="We can provide high-resolution images, spec sheets, and an on the record contact."
        href={mailHref(BUSINESS_EMAIL)}
        label="Email us"
      />
    </InfoPage>
  );
}
