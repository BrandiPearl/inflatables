import type { Metadata } from "next";
import { AdminShell } from "@/components/cms/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Wonderland CMS",
  },
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
