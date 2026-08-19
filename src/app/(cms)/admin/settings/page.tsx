import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { getSiteSettings } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/cms/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Business details, SEO defaults, and the announcement bar."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
