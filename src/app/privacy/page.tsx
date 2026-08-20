import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/info-page";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Wonderland Inflatables collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Last updated August 18, 2026. This policy explains what information we collect when you use wonderlandinflatables.com and how we use it."
    >
      <InfoSection title="Information we collect">
        <p>
          When you request a quote, send a contact message, or place an order, we
          collect your name, email, phone number, address, and the details of your
          event or order. We also collect basic analytics such as pages visited,
          device type, and referring site. If you use live chat, Tawk.to processes
          those messages on our behalf so we can answer you.
        </p>
      </InfoSection>

      <InfoSection title="How we use it">
        <p>
          We use this information to respond to quotes, fulfill orders, improve the
          site, and send order-related email. We do not sell your personal information.
          We may share it with shipping carriers, payment processors, and other
          vendors who need it to complete your request.
        </p>
      </InfoSection>

      <InfoSection title="Cookies">
        <p>
          We use cookies to keep the site working (for example, cart and session) and
          to measure traffic. You can block cookies in your browser. Some site features
          may not work if you do.
        </p>
      </InfoSection>

      <InfoSection title="Your choices">
        <p>
          Email us at{" "}
          <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">
            {BUSINESS_EMAIL}
          </a>{" "}
          to request a copy of your data, correct it, or ask us to delete it. We will
          respond within 30 days.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Email us at{" "}
          <a href={mailHref(BUSINESS_EMAIL)} className="text-orange-600 font-medium">
            {BUSINESS_EMAIL}
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
