import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoCta } from "@/components/layout/info-page";
import { CheckCircle2 } from "lucide-react";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Returns & Warranty",
  description:
    "Wonderland Inflatables 1-year commercial warranty, return policy, and how to file a claim for manufacturing defects.",
};

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Returns & Warranty"
      intro="Every commercial inflatable we sell is backed by a 1-year limited warranty covering manufacturing defects. Here's how returns, warranty claims, and repairs work."
    >
      <InfoSection title="1-year commercial warranty">
        <p>
          All products carry a 1-year limited commercial warranty covering defects in
          materials and workmanship from the date of delivery. This includes seam
          failures, blower motor defects, and vinyl manufacturing flaws under normal
          commercial use.
        </p>
        <p>The warranty does not cover:</p>
        <ul>
          <li>Damage from misuse, over-inflation, or improper anchoring</li>
          <li>Tears, punctures, or abrasions from normal rental use</li>
          <li>Damage from weather, UV exposure, or improper storage (mold/mildew)</li>
          <li>Wear items such as stakes, straps, and blower filters</li>
          <li>Units modified after delivery</li>
        </ul>
      </InfoSection>

      <InfoSection title="Return window">
        <p>
          Unused units in original condition may be returned within 14 days of delivery
          for a refund, minus outbound freight. The unit must be unused, dry, and packed
          in the original bag. Return shipping is the customer's responsibility unless
          the unit arrived damaged or incorrect.
        </p>
        <p>
          Custom artwork, made to order units, and used/refurbished products are not
          eligible for return.
        </p>
      </InfoSection>

      <InfoSection title="How to file a warranty claim">
        <ol>
          <li>Email <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">{BUSINESS_EMAIL}</a> with your order number, photos of the defect, and a short description.</li>
          <li>We review claims within 2 business days.</li>
          <li>Approved claims are resolved with a repair kit, replacement part, or replacement unit, depending on the issue.</li>
          <li>Do not return a unit until we issue a Return Merchandise Authorization (RMA).</li>
        </ol>
      </InfoSection>

      <InfoSection title="Freight damage">
        <p>
          Inspect your delivery before signing the bill of lading. Note any visible
          damage on the delivery receipt and photograph it immediately. Contact us
          within 48 hours of delivery. We will work with the freight carrier to
          resolve the claim at no cost to you.
        </p>
      </InfoSection>

      <InfoSection title="Extended warranty">
        <p>
          An optional 2-year extended warranty is available at purchase for 8% of the
          unit price. It extends the same coverage for an additional 12 months. Ask
          your sales contact to add it before checkout.
        </p>
      </InfoSection>

      <div className="mb-8 space-y-2">
        {[
          "Repair kit included with every unit",
          "Claims reviewed within 2 business days",
          "ASTM F2374 documentation available on request",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>

      <InfoCta
        title="Need to start a claim?"
        body="Send photos and your order number. We'll get back to you within 2 business hours."
        href="/contact"
        label="Contact Support"
      />
    </InfoPage>
  );
}
