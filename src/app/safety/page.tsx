import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoCta } from "@/components/layout/info-page";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Safety Guidelines",
  description:
    "Commercial inflatable safety guidelines for rental operators and event organizers. ASTM F2374, staking, capacity, weather, and attendant rules.",
};

export default function SafetyPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Safety Guidelines"
      intro="Safety is not optional. These rules apply to every commercial inflatable we sell. Share them with your attendants before every rental."
    >
      <InfoSection title="Before you inflate">
        <ul>
          <li>Inspect the ground. Remove rocks, sticks, sprinkler heads, and debris.</li>
          <li>The surface should be level (no more than a 2-degree slope).</li>
          <li>Never set up on concrete or asphalt without protective mats.</li>
          <li>Confirm you have enough clearance from fences, trees, power lines, and buildings.</li>
          <li>Check that outlets match the blower requirements (typically 20-amp circuits).</li>
        </ul>
      </InfoSection>

      <InfoSection title="Anchoring">
        <p>
          Stake every manufacturer-specified anchor point on grass. On hard surfaces,
          use sandbags rated for the unit's wind resistance. Never operate in sustained
          winds over 15-20 mph. Check the spec sheet for the exact limit on each unit.
        </p>
      </InfoSection>

      <InfoSection title="During operation">
        <ul>
          <li>Post one dedicated attendant per unit. Their job is capacity, blower, and behavior.</li>
          <li>Never turn off the blower with people inside. The unit collapses in seconds.</li>
          <li>Enforce posted capacity limits. Overcrowding is the most common cause of injury.</li>
          <li>Do not mix age and size groups in the same bounce area.</li>
          <li>Riders remove shoes, glasses, and hard jewelry before entering.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Weather">
        <p>
          Check a reliable weather app before every setup. At the first sign of
          lightning within 10 miles, clear and deflate all units immediately. Lightning
          can travel through metal stakes. Do not wait for rain to arrive before
          deflating. High wind is equally serious. If gusts approach the unit's limit,
          evacuate and deflate.
        </p>
      </InfoSection>

      <InfoSection title="Standards and insurance">
        <p>
          All Wonderland units meet or exceed ASTM F2374. Certification documents ship
          with your order and are available on request for permits and insurance.
          Most operators carry $1M per-occurrence / $2M aggregate commercial general
          liability with inflatables listed as covered equipment.
        </p>
        <p>
          Permit rules vary by state. Contact your Department of Labor or consumer
          protection office before operating commercially. See our{" "}
          <Link href="/faq" className="text-orange-600 font-medium">FAQ</Link>{" "}
          and{" "}
          <Link href="/blog/inflatable-safety-tips-event-organizers" className="text-orange-600 font-medium">
            safety article
          </Link>{" "}
          for more detail.
        </p>
      </InfoSection>

      <InfoCta
        title="Questions about a specific unit?"
        body="Our team can walk you through setup, staking, and capacity for any product in the catalog."
        href="/contact"
      />
    </InfoPage>
  );
}
