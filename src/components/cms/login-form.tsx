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
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next.startsWith("/admin") ? next : "/admin"} />
      <FormAlert state={state} />
      <div>
        <label className="label text-slate-300" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="input bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center">
              <Logo variant="light" size="sm" href="/" />
            </div>
            <h1 className="font-display text-xl font-bold text-white">Wonderland CMS</h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage products, blog posts, and customer inquiries.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
