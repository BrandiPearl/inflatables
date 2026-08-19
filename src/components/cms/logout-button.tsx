"use client";

import { logout } from "@/app/(cms)/admin/actions";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoutButton({ variant = "header" }: { variant?: "header" | "sidebar" }) {
  return (
    <form action={logout} className={variant === "sidebar" ? "w-full" : undefined}>
      <button
        type="submit"
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          variant === "sidebar"
            ? "w-full rounded-lg px-3 py-2.5 font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            : "text-slate-500 hover:text-red-600"
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    </form>
  );
}
