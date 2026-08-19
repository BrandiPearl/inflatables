"use client";

import { logout } from "@/app/(cms)/admin/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors ml-2"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign out
      </button>
    </form>
  );
}
