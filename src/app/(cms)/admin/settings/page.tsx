import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/cms/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Business details, SEO defaults, and the announcement bar.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
