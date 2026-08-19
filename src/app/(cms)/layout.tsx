import type { Metadata } from "next";
import { AdminNav } from "@/components/cms/admin-nav";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Wonderland CMS",
  },
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav />
      <main className="flex-1 container-wide py-8">{children}</main>
    </div>
  );
}
