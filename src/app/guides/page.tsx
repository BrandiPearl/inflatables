import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoCta } from "@/components/layout/info-page";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Setup Guides",
  description:
    "Setup, storage, and maintenance guides for commercial bounce houses, water slides, and obstacle courses from Wonderland Inflatables.",
};

const GUIDES = [
  {
    title: "First-time setup",
    body: "Unpack, stake, connect the blower, and inflate in the right order. Typical setup is 10-25 minutes depending on unit size.",
    steps: [
      "Clear and level the footprint. Lay down a ground tarp if the surface is rough.",
      "Unroll the unit with the blower tube facing the outlet.",
      "Stake all corners and mid-points before you turn the blower on.",
      "Attach the blower, zip remaining tubes, then power on.",
      "Walk the seams once inflated. Confirm no kinks in the blower tube.",
    ],
  },
  {
    title: "Water slide setup",
    body: "Same as a dry unit, plus water hookup and splash pool placement.",
    steps: [
      "Confirm you have a garden hose and a drain path for the splash pool.",
      "Attach the spray bar after the unit is fully inflated, not before.",
      "Start with low water pressure and increase until the lane is wet, not flooding.",
      "After the event, drain the pool completely before deflating.",
    ],
  },
  {
    title: "Takedown and storage",
    body: "Moisture is the leading cause of premature failure. Never bag a wet unit.",
    steps: [
      "Clear all riders. Turn off and disconnect the blower.",
      "Unstake after the unit is mostly deflated so fabric does not tear on stakes.",
      "Fold, do not crumple. Follow the same fold pattern every time.",
      "If the unit is wet, hang or spread it until fully dry before bagging.",
      "Store in a cool, dry location off the concrete floor.",
    ],
  },
  {
    title: "Routine maintenance",
    body: "A 10-minute inspection after every rental prevents expensive repairs.",
    steps: [
      "Check seams, climbing handles, and slide lanes for wear.",
      "Wipe vinyl with mild soap and water. No bleach or petroleum solvents.",
      "Patch small punctures with the included commercial repair kit.",
      "Clean blower filters and confirm the motor is free of debris.",
    ],
  },
];

export default function GuidesPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Setup Guides"
      intro="Practical setup, takedown, and care instructions for commercial inflatables. Every purchase also includes a unit-specific checklist."
    >
      <div className="space-y-8 mb-10">
        {GUIDES.map((guide) => (
          <section key={guide.title}>
            <h2 className="text-lg font-bold text-slate-900 mb-1">{guide.title}</h2>
            <p className="text-sm text-slate-500 mb-3">{guide.body}</p>
            <ol>
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <p className="text-sm text-slate-600 mb-8">
        For more operator advice, read{" "}
        <Link
          href="/blog/how-to-start-inflatable-rental-business"
          className="text-orange-600 font-medium inline-flex items-center gap-1"
        >
          How to start a rental business <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </p>

      <InfoCta
        title="Need a walkthrough for a specific unit?"
        body="We can send a setup video or hop on a call before your first event."
        href="/contact"
      />
    </InfoPage>
  );
}
