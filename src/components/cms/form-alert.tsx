export function FormAlert({ state }: { state: { error?: string; success?: string } | null }) {
  if (!state?.error && !state?.success) return null;
  return (
    <p
      className={`rounded-lg px-3 py-2 text-sm ${
        state.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {state.error || state.success}
    </p>
  );
}
