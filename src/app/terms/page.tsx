import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/info-page";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for purchasing and using Wonderland Inflatables products and website.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="Last updated August 18, 2026. By using this website or placing an order, you agree to these terms."
    >
      <InfoSection title="Orders and pricing">
        <p>
          Product prices are listed in US dollars and do not include freight unless
          noted. Quotes are valid for 14 days unless otherwise stated. We may refuse
          or cancel an order if a product is listed at an obvious error price, is out
          of stock, or if we cannot verify payment.
        </p>
      </InfoSection>

      <InfoSection title="Payment">
        <p>
          Payment is due before shipment unless we have agreed to other terms in
          writing. Financing, if offered, is provided by third-party partners and is
          subject to their approval and agreements.
        </p>
      </InfoSection>

      <InfoSection title="Shipping and risk of loss">
        <p>
          Title and risk of loss pass to you when the carrier picks up the order from
          our warehouse, unless we agree otherwise. Inspect freight on delivery and
          note damage on the bill of lading. See our Shipping and Returns pages for
          the process.
        </p>
      </InfoSection>

      <InfoSection title="Warranty">
        <p>
          Products are covered by our 1-year limited commercial warranty as described
          on the Returns & Warranty page. Except for that warranty, products are sold
          as-is to the fullest extent allowed by law.
        </p>
      </InfoSection>

      <InfoSection title="Website use">
        <p>
          You may not scrape, copy, or republish our catalog, photos, or content
          without written permission, except as allowed by law. Product images and
          descriptions are for shopping on this site.
        </p>
      </InfoSection>

      <InfoSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Wonderland Inflatables is not
          liable for indirect, incidental, or consequential damages, including lost
          rental revenue. Our total liability for any claim related to an order is
          limited to the amount you paid for the product at issue.
        </p>
      </InfoSection>

      <InfoSection title="Governing law">
        <p>
          These terms are governed by the laws of the State of California, without
          regard to conflict of law rules. Disputes will be resolved in the state or
          federal courts located in San Bernardino County, California.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Questions about these terms:{" "}
          <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">
            {BUSINESS_EMAIL}
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
