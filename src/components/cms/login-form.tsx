"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/(cms)/admin/actions";
import type { ActionState } from "@/lib/cms/form";
import { FormAlert } from "@/components/cms/form-alert";
import { Logo } from "@/components/ui/logo";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [state, action, pending] = useActionState<ActionState, FormData>(login, null);

  return (
    <form action={action} className="bg-white rounded-2xl border border-slate-100 p-8 space-y-4 shadow-sm">
      <input type="hidden" name="next" value={next.startsWith("/admin") ? next : "/admin"} />
      <FormAlert state={state} />
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="input"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center text-sm py-2.5" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function LoginPageClient() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo size="sm" href="/" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Wonderland CMS</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage the catalog, blog, and quotes.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
