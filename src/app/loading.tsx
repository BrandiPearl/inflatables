export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-orange-600 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Loading…</span>
      </div>
    </div>
  );
}
