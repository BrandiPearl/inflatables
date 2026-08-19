import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoCta } from "@/components/layout/info-page";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Shipping Info",
  description:
    "Wonderland Inflatables ships commercial inflatables via LTL freight to all 48 contiguous US states. Free terminal shipping on orders over $2,500.",
};

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Shipping Info"
      intro="We ship from our Ontario, California warehouse via LTL freight. Most orders leave within 3-5 business days of payment confirmation."
    >
      <InfoSection title="Where we ship">
        <p>
          We ship to all 48 contiguous US states. We do not currently ship to Alaska,
          Hawaii, US territories, or internationally. If you need a unit delivered to
          a job site, warehouse, or residential address, we can arrange it.
        </p>
      </InfoSection>

      <InfoSection title="Transit times">
        <p>Typical transit after the order ships:</p>
        <ul>
          <li>West Coast: 2-3 business days</li>
          <li>Mountain and Midwest: 3-5 business days</li>
          <li>East Coast and Southeast: 5-7 business days</li>
        </ul>
        <p>
          Transit times are estimates. Weather, carrier volume, and appointment
          windows can add a day or two.
        </p>
      </InfoSection>

      <InfoSection title="Shipping cost">
        <p>
          Freight is quoted by weight, pallet size, and destination ZIP. Orders over
          $2,500 qualify for free terminal shipping (you pick up at a local freight
          terminal). Residential / liftgate delivery and inside delivery are available
          for an additional fee.
        </p>
        <p>
          Request a shipping quote with your order by filling out the{" "}
          <a href="/quote" className="text-orange-600 font-medium">quote form</a>{" "}
          or emailing{" "}
          <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">
            {BUSINESS_EMAIL}
          </a>
          .
        </p>
      </InfoSection>

      <InfoSection title="What arrives">
        <p>
          Units ship folded in a heavy duty bag, typically on a pallet. Each order
          includes the inflatable, commercial blower(s), stakes, tie-down straps, a
          repair kit, and a setup / safety checklist.
        </p>
      </InfoSection>

      <InfoSection title="Receiving your shipment">
        <p>
          LTL freight is scheduled. The carrier will call to set a delivery window.
          Have a forklift, pallet jack, or extra hands ready. Inspect the pallet
          before signing. Note any damage on the bill of lading and photograph it
          before the driver leaves.
        </p>
      </InfoSection>

      <InfoCta
        title="Need a shipping quote?"
        body="Tell us your ZIP and the units you want. We'll send freight pricing with your product quote."
        href="/quote"
        label="Get a Quote"
      />
    </InfoPage>
  );
}
