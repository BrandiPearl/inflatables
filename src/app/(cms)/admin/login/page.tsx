import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPageClient } from "@/components/cms/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}
