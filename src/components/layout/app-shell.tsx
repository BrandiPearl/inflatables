"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { TawkChat } from "@/components/layout/tawk-chat";
import { CartProvider } from "@/components/cart/cart-provider";
import { SettingsProvider } from "@/components/layout/settings-provider";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import type { SiteSettings } from "@/lib/queries/settings";

export function AppShell({
  settings,
  initialCountry,
  initialCurrency,
  children,
}: {
  settings: SiteSettings;
  initialCountry?: string;
  initialCurrency?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <SettingsProvider settings={settings}>
      <CurrencyProvider initialCountry={initialCountry} initialCurrency={initialCurrency}>
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
          <TawkChat />
        </CartProvider>
      </CurrencyProvider>
    </SettingsProvider>
  );
}
